// Conexión a MySQL (TiDB en la nube). Solo se puede usar en el servidor.
//
// Funciona en dos sitios distintos:
// - En Node.js (tu ordenador con `npm run dev`): un "pool" mantiene varias conexiones abiertas
//   y las reparte entre visitas.
// - En Cloudflare Workers (la web publicada): Cloudflare NO deja reutilizar una conexión entre
//   visitas, así que se abre una nueva cada vez. Va rápido porque se conecta a Hyperdrive,
//   un servicio de Cloudflare que mantiene abiertas las conexiones con TiDB.
import "server-only";
import mysql from "mysql2/promise";

const enCloudflare = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

// mysql2 genera código al vuelo para ir más rápido, pero Cloudflare no lo permite: disableEval lo evita
const opcionesComunes = { disableEval: enCloudflare };

// Datos de conexión de las variables de entorno (.env.local en tu ordenador)
const desdeVariables = (): mysql.ConnectionOptions => ({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Los servicios en la nube (TiDB, Aiven...) exigen conexión cifrada
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
});

// En Cloudflare: los datos de Hyperdrive (si está configurado) o, si no, las variables
async function opcionesCloudflare(): Promise<mysql.ConnectionOptions> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext({ async: true });
  const hyperdrive = (env as { HYPERDRIVE?: { host: string; port: number; user: string; password: string; database: string } }).HYPERDRIVE;
  if (!hyperdrive) return desdeVariables();
  // Hyperdrive ya se conecta a TiDB cifrado; entre el Worker y Hyperdrive no hace falta SSL
  return { host: hyperdrive.host, port: hyperdrive.port, user: hyperdrive.user, password: hyperdrive.password, database: hyperdrive.database };
}

// --- Node.js: pool compartido. En desarrollo Next recarga los módulos a menudo, así que
// lo guardamos en globalThis para no abrir conexiones nuevas en cada recarga.
const globalForDb = globalThis as unknown as { pool?: mysql.Pool };

function pool(): mysql.Pool {
  globalForDb.pool ??= mysql.createPool({ ...desdeVariables(), ...opcionesComunes, connectionLimit: 5 });
  return globalForDb.pool;
}

// --- Cloudflare: una conexión nueva para cada uso, que se cierra al terminar
async function conexionNueva() {
  return mysql.createConnection({ ...(await opcionesCloudflare()), ...opcionesComunes });
}

async function conConexion<T>(trabajo: (c: mysql.Connection) => Promise<T>): Promise<T> {
  const c = await conexionNueva();
  try {
    return await trabajo(c);
  } finally {
    c.end().catch(() => {});
  }
}

// Lo que usa el resto de la web: db.query, db.execute y db.getConnection (para transacciones).
// Funcionan igual en los dos sitios.
export const db = {
  query: ((...args: unknown[]) =>
    enCloudflare
      ? conConexion((c) => (c.query as (...a: unknown[]) => Promise<unknown>)(...args))
      : (pool().query as (...a: unknown[]) => Promise<unknown>)(...args)) as mysql.Pool["query"],

  execute: ((...args: unknown[]) =>
    enCloudflare
      ? conConexion((c) => (c.execute as (...a: unknown[]) => Promise<unknown>)(...args))
      : (pool().execute as (...a: unknown[]) => Promise<unknown>)(...args)) as mysql.Pool["execute"],

  // Una conexión para varias órdenes seguidas (transacciones). Hay que llamar a release() al acabar.
  async getConnection(): Promise<mysql.PoolConnection> {
    if (!enCloudflare) return pool().getConnection();
    const c = await conexionNueva();
    return Object.assign(c, { release: () => void c.end().catch(() => {}) }) as unknown as mysql.PoolConnection;
  },
};
