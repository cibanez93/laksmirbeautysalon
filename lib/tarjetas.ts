// Consultas a la tabla "tarjetas_regalo" de la tienda
import "server-only";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "./db";

export interface TarjetaRegalo {
  id: number;
  nombre: string;
  importe: number;
  foto_id: number | null;
  activo: boolean;
  orden: number;
}

export type DatosTarjeta = Omit<TarjetaRegalo, "id" | "foto_id">;

const COLUMNAS = "id, nombre, importe, foto_id, activo, orden";

// mysql2 devuelve DECIMAL como texto y BOOLEAN como 0/1: los convertimos
const aTarjeta = (f: RowDataPacket): TarjetaRegalo => ({
  id: f.id,
  nombre: f.nombre,
  importe: Number(f.importe),
  foto_id: f.foto_id,
  activo: Boolean(f.activo),
  orden: f.orden,
});

export async function listarTarjetasActivas(): Promise<TarjetaRegalo[]> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT ${COLUMNAS} FROM tarjetas_regalo WHERE activo = TRUE ORDER BY orden, importe`);
  return rows.map(aTarjeta);
}

export async function listarTarjetas(): Promise<TarjetaRegalo[]> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT ${COLUMNAS} FROM tarjetas_regalo ORDER BY orden, importe`);
  return rows.map(aTarjeta);
}

export async function obtenerTarjeta(id: number): Promise<(TarjetaRegalo & { version: number }) | null> {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT ${COLUMNAS}, UNIX_TIMESTAMP(actualizado_en) AS version FROM tarjetas_regalo WHERE id = ?`,
    [id]
  );
  return rows[0] ? { ...aTarjeta(rows[0]), version: Number(rows[0].version) } : null;
}

export async function crearTarjeta(d: DatosTarjeta): Promise<number> {
  const [res] = await db.execute<ResultSetHeader>(
    "INSERT INTO tarjetas_regalo (nombre, importe, activo, orden) VALUES (?, ?, ?, ?)",
    [d.nombre, d.importe, d.activo, d.orden]
  );
  return res.insertId;
}

export async function actualizarTarjeta(id: number, d: DatosTarjeta) {
  await db.execute("UPDATE tarjetas_regalo SET nombre = ?, importe = ?, activo = ?, orden = ? WHERE id = ?", [d.nombre, d.importe, d.activo, d.orden, id]);
}

export async function cambiarFotoTarjeta(id: number, foto_id: number | null) {
  await db.execute("UPDATE tarjetas_regalo SET foto_id = ? WHERE id = ?", [foto_id, id]);
}

export async function cambiarActivoTarjeta(id: number, activo: boolean) {
  await db.execute("UPDATE tarjetas_regalo SET activo = ? WHERE id = ?", [activo, id]);
}

export async function borrarTarjeta(id: number) {
  await db.execute("DELETE FROM tarjetas_regalo WHERE id = ?", [id]);
}
