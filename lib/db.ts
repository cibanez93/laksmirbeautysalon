// Conexión a MySQL (TiDB en la nube). Solo se puede usar en el servidor.
//
// Funciona en dos sitios distintos:
// - En Node.js (tu ordenador con `npm run dev`): mysql2, con un "pool" que mantiene varias
//   conexiones abiertas y las reparte entre visitas.
// - En Cloudflare Workers (la web publicada): el driver oficial de TiDB (@tidbcloud/serverless),
//   que habla con TiDB por HTTPS. mysql2 no sirve ahí: Cloudflare no tiene las funciones de Node
//   que usa para cifrar la conexión, y Hyperdrive todavía no es compatible con TiDB Serverless.
//
// El resto de la web siempre usa lo mismo: db.query, db.execute y db.getConnection,
// con las respuestas en el formato de mysql2. Aquí se traduce lo que haga falta.
import "server-only";
import { connect, type Connection as ConexionTiDB, type FullResult, type Tx } from "@tidbcloud/serverless";
import mysql from "mysql2/promise";

const enCloudflare = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

// ---------------------------------------------------------------------------
// Node.js: mysql2 con un pool compartido. En desarrollo Next recarga los módulos a menudo,
// así que lo guardamos en globalThis para no abrir conexiones nuevas en cada recarga.
// ---------------------------------------------------------------------------
const globalForDb = globalThis as unknown as { pool?: mysql.Pool };

function pool(): mysql.Pool {
  globalForDb.pool ??= mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    // Los servicios en la nube (TiDB, Aiven...) exigen conexión cifrada
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  });
  return globalForDb.pool;
}

// ---------------------------------------------------------------------------
// Cloudflare: driver de TiDB por HTTPS. No guarda conexiones abiertas: cada consulta es una petición.
// ---------------------------------------------------------------------------
function tidb(): ConexionTiDB<{ fullResult: true }> {
  return connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    fullResult: true,
  });
}

// El driver de TiDB devuelve las fechas como texto y las fotos como Uint8Array.
// Las pasamos a Date y Buffer, como hace mysql2, para que el resto del código no note la diferencia.
const FECHAS = new Set(["DATETIME", "TIMESTAMP"]);
const BINARIOS = new Set(["BLOB", "TINYBLOB", "MEDIUMBLOB", "LONGBLOB", "BINARY", "VARBINARY"]);

// ¿La orden devuelve filas (SELECT) o cambia datos (INSERT, UPDATE, DELETE)?
// Se mira el texto de la orden: el driver devuelve una lista vacía de filas también en los INSERT.
const devuelveFilas = (sql: string) => /^\s*(select|show|with|describe|explain)\b/i.test(sql);

function aFormatoMysql2(sql: string, r: FullResult) {
  // SELECT: devuelve filas
  if (devuelveFilas(sql)) {
    const tipos = Object.entries(r.types ?? {});
    const filas = (r.rows ?? []).map((fila) => {
      const f = fila as Record<string, unknown>;
      for (const [columna, tipo] of tipos) {
        const valor = f[columna];
        if (valor == null) continue;
        if (FECHAS.has(tipo)) f[columna] = new Date(`${String(valor).replace(" ", "T")}Z`);
        else if (BINARIOS.has(tipo)) f[columna] = Buffer.from(valor as Uint8Array);
      }
      return f;
    });
    return [filas, []];
  }
  // INSERT, UPDATE, DELETE: cuántas filas cambiaron y el id nuevo
  return [{ affectedRows: r.rowsAffected ?? 0, insertId: Number(r.lastInsertId ?? 0) }, undefined];
}

type Ejecutor = { execute: (sql: string, args?: unknown[] | null) => Promise<unknown> };

const ejecutarEn = async (ejecutor: Ejecutor, sql: string, valores?: unknown) =>
  aFormatoMysql2(sql, (await ejecutor.execute(sql, (valores as unknown[]) ?? null)) as FullResult);

// Una "conexión" para transacciones: todas las órdenes entre begin y commit van juntas
function conexionTransaccion() {
  const conexion = tidb();
  let tx: Tx<{ fullResult: true }> | null = null;
  const ejecutar = (sql: string, valores?: unknown) => ejecutarEn((tx ?? conexion) as Ejecutor, sql, valores);
  return {
    query: ejecutar,
    execute: ejecutar,
    beginTransaction: async () => {
      tx = await conexion.begin();
    },
    commit: async () => {
      await tx?.commit();
      tx = null;
    },
    rollback: async () => {
      await tx?.rollback();
      tx = null;
    },
    release: () => {},
  };
}

// ---------------------------------------------------------------------------
// Lo que usa el resto de la web
// ---------------------------------------------------------------------------
type Consulta = (...args: unknown[]) => Promise<unknown>;

export const db = {
  query: ((sql: string, valores?: unknown) =>
    enCloudflare ? ejecutarEn(tidb() as Ejecutor, sql, valores) : (pool().query as Consulta)(sql, valores)) as mysql.Pool["query"],

  execute: ((sql: string, valores?: unknown) =>
    enCloudflare ? ejecutarEn(tidb() as Ejecutor, sql, valores) : (pool().execute as Consulta)(sql, valores)) as mysql.Pool["execute"],

  // Una conexión para varias órdenes seguidas (transacciones). Hay que llamar a release() al acabar.
  async getConnection(): Promise<mysql.PoolConnection> {
    if (!enCloudflare) return pool().getConnection();
    return conexionTransaccion() as unknown as mysql.PoolConnection;
  },
};
