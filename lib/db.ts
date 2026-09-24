// Conexión reutilizable a MySQL. Solo se puede usar en el servidor.
import "server-only";
import mysql from "mysql2/promise";

// Un "pool" mantiene varias conexiones abiertas y las reparte entre peticiones.
// En desarrollo Next recarga los módulos a menudo, así que guardamos el pool en
// globalThis para no abrir conexiones nuevas en cada recarga.
const globalForDb = globalThis as unknown as { pool?: mysql.Pool };

export const db =
  globalForDb.pool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    // Los servicios en la nube (TiDB, Aiven...) exigen conexión cifrada
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = db;
