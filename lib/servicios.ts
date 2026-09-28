// Consultas a las tablas "servicios" y "categorias". Todo el SQL de servicios vive aquí.
import "server-only";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "./db";

export interface Servicio {
  id: number;
  categoria_id: number | null;
  categoria: string | null; // slug de la categoría, p. ej. "peluqueria"
  nombre: string;
  descripcion: string;
  duracion_min: number | null;
  orden: number;
  activo: boolean;
}

export type DatosServicio = Omit<Servicio, "id" | "categoria">;

export interface CategoriaDb {
  id: number;
  slug: string;
  nombre: string;
}

// mysql2 devuelve BOOLEAN como 0/1: lo convertimos
function aServicio(fila: RowDataPacket): Servicio {
  return {
    id: fila.id,
    categoria_id: fila.categoria_id,
    categoria: fila.categoria,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    duracion_min: fila.duracion_min,
    orden: fila.orden,
    activo: Boolean(fila.activo),
  };
}

// JOIN: junta cada servicio con su categoría. LEFT JOIN para no perder servicios sin categoría.
const SELECT_SERVICIOS = `
  SELECT s.id, s.categoria_id, c.slug AS categoria, s.nombre, s.descripcion, s.duracion_min, s.orden, s.activo
    FROM servicios s
    LEFT JOIN categorias c ON c.id = s.categoria_id`;
const ORDEN = "ORDER BY c.orden IS NULL, c.orden, s.orden, s.id";

// Para la web pública: solo los activos
export async function listarServiciosActivos(): Promise<Servicio[]> {
  const [rows] = await db.query<RowDataPacket[]>(`${SELECT_SERVICIOS} WHERE s.activo = TRUE ${ORDEN}`);
  return rows.map(aServicio);
}

// Para el panel: todos
export async function listarServicios(): Promise<Servicio[]> {
  const [rows] = await db.query<RowDataPacket[]>(`${SELECT_SERVICIOS} ${ORDEN}`);
  return rows.map(aServicio);
}

export async function obtenerServicio(id: number): Promise<Servicio | null> {
  const [rows] = await db.execute<RowDataPacket[]>(`${SELECT_SERVICIOS} WHERE s.id = ?`, [id]);
  return rows[0] ? aServicio(rows[0]) : null;
}

export async function listarCategorias(): Promise<CategoriaDb[]> {
  const [rows] = await db.query<RowDataPacket[]>("SELECT id, slug, nombre FROM categorias ORDER BY orden, id");
  return rows.map((f) => ({ id: f.id, slug: f.slug, nombre: f.nombre }));
}

// Los "?" son parámetros: mysql2 escapa los valores y así evitamos inyección SQL.
// Nunca metas datos del usuario directamente en el texto de la consulta.
export async function crearServicio(d: DatosServicio): Promise<number> {
  const [res] = await db.execute<ResultSetHeader>(
    `INSERT INTO servicios (categoria_id, nombre, descripcion, duracion_min, orden, activo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [d.categoria_id, d.nombre, d.descripcion, d.duracion_min, d.orden, d.activo]
  );
  return res.insertId;
}

export async function actualizarServicio(id: number, d: DatosServicio) {
  await db.execute(
    `UPDATE servicios
        SET categoria_id = ?, nombre = ?, descripcion = ?, duracion_min = ?, orden = ?, activo = ?
      WHERE id = ?`,
    [d.categoria_id, d.nombre, d.descripcion, d.duracion_min, d.orden, d.activo, id]
  );
}

export async function cambiarActivo(id: number, activo: boolean) {
  await db.execute("UPDATE servicios SET activo = ? WHERE id = ?", [activo, id]);
}

export async function borrarServicio(id: number) {
  await db.execute("DELETE FROM servicios WHERE id = ?", [id]);
}
