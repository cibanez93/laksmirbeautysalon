// Consultas a la tabla "servicios". Todo el SQL de servicios vive aquí.
import "server-only";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "./db";

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number | null;
  duracion_min: number | null;
  orden: number;
  activo: boolean;
}

export type DatosServicio = Omit<Servicio, "id">;

// mysql2 devuelve DECIMAL como texto y BOOLEAN como 0/1: los convertimos
function aServicio(fila: RowDataPacket): Servicio {
  return {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    precio: fila.precio === null ? null : Number(fila.precio),
    duracion_min: fila.duracion_min,
    orden: fila.orden,
    activo: Boolean(fila.activo),
  };
}

const COLUMNAS = "id, nombre, descripcion, precio, duracion_min, orden, activo";

// Para la web pública: solo los activos
export async function listarServiciosActivos(): Promise<Servicio[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT ${COLUMNAS} FROM servicios WHERE activo = TRUE ORDER BY orden, id`
  );
  return rows.map(aServicio);
}

// Para el panel: todos
export async function listarServicios(): Promise<Servicio[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT ${COLUMNAS} FROM servicios ORDER BY orden, id`
  );
  return rows.map(aServicio);
}

export async function obtenerServicio(id: number): Promise<Servicio | null> {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT ${COLUMNAS} FROM servicios WHERE id = ?`,
    [id]
  );
  return rows[0] ? aServicio(rows[0]) : null;
}

// Los "?" son parámetros: mysql2 escapa los valores y así evitamos inyección SQL.
// Nunca metas datos del usuario directamente en el texto de la consulta.
export async function crearServicio(d: DatosServicio): Promise<number> {
  const [res] = await db.execute<ResultSetHeader>(
    `INSERT INTO servicios (nombre, descripcion, precio, duracion_min, orden, activo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [d.nombre, d.descripcion, d.precio, d.duracion_min, d.orden, d.activo]
  );
  return res.insertId;
}

export async function actualizarServicio(id: number, d: DatosServicio) {
  await db.execute(
    `UPDATE servicios
        SET nombre = ?, descripcion = ?, precio = ?, duracion_min = ?, orden = ?, activo = ?
      WHERE id = ?`,
    [d.nombre, d.descripcion, d.precio, d.duracion_min, d.orden, d.activo, id]
  );
}

export async function cambiarActivo(id: number, activo: boolean) {
  await db.execute("UPDATE servicios SET activo = ? WHERE id = ?", [activo, id]);
}

export async function borrarServicio(id: number) {
  await db.execute("DELETE FROM servicios WHERE id = ?", [id]);
}
