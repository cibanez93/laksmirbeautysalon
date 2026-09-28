// Consultas a las tablas "servicios" y "categorias". Todo el SQL de servicios vive aquí.
import "server-only";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "./db";

export interface Servicio {
  id: number;
  categoria_id: number | null;
  categoria: string | null; // slug de la categoría, p. ej. "peluqueria"
  foto_id: number | null;
  nombre: string;
  descripcion: string;
  duracion_min: number | null;
  precio: number | null; // solo se ve en la tienda (bonos regalo)
  orden: number;
  activo: boolean;
  regalable: boolean; // se puede comprar como bono regalo
}

export type DatosServicio = Omit<Servicio, "id" | "categoria" | "foto_id">;

export interface CategoriaDb {
  id: number;
  slug: string;
  nombre: string;
}

// mysql2 devuelve BOOLEAN como 0/1 y DECIMAL como texto: los convertimos
function aServicio(fila: RowDataPacket): Servicio {
  return {
    id: fila.id,
    categoria_id: fila.categoria_id,
    categoria: fila.categoria,
    foto_id: fila.foto_id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    duracion_min: fila.duracion_min,
    precio: fila.precio === null ? null : Number(fila.precio),
    orden: fila.orden,
    activo: Boolean(fila.activo),
    regalable: Boolean(fila.regalable),
  };
}

// JOIN: junta cada servicio con su categoría. LEFT JOIN para no perder servicios sin categoría.
const SELECT_SERVICIOS = `
  SELECT s.id, s.categoria_id, c.slug AS categoria, s.foto_id, s.nombre, s.descripcion, s.duracion_min, s.precio, s.orden, s.activo, s.regalable
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

export async function obtenerServicio(id: number): Promise<(Servicio & { version: number }) | null> {
  const [rows] = await db.execute<RowDataPacket[]>(
    SELECT_SERVICIOS.replace("s.regalable", "s.regalable, UNIX_TIMESTAMP(s.actualizado_en) AS version") + " WHERE s.id = ?",
    [id]
  );
  return rows[0] ? { ...aServicio(rows[0]), version: Number(rows[0].version) } : null;
}

export async function listarCategorias(): Promise<CategoriaDb[]> {
  const [rows] = await db.query<RowDataPacket[]>("SELECT id, slug, nombre FROM categorias ORDER BY orden, id");
  return rows.map((f) => ({ id: f.id, slug: f.slug, nombre: f.nombre }));
}

// Los "?" son parámetros: mysql2 escapa los valores y así evitamos inyección SQL.
// Nunca metas datos del usuario directamente en el texto de la consulta.
export async function crearServicio(d: DatosServicio): Promise<number> {
  const [res] = await db.execute<ResultSetHeader>(
    `INSERT INTO servicios (categoria_id, nombre, descripcion, duracion_min, precio, orden, activo, regalable)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [d.categoria_id, d.nombre, d.descripcion, d.duracion_min, d.precio, d.orden, d.activo, d.regalable]
  );
  return res.insertId;
}

export async function actualizarServicio(id: number, d: DatosServicio) {
  await db.execute(
    `UPDATE servicios
        SET categoria_id = ?, nombre = ?, descripcion = ?, duracion_min = ?, precio = ?, orden = ?, activo = ?, regalable = ?
      WHERE id = ?`,
    [d.categoria_id, d.nombre, d.descripcion, d.duracion_min, d.precio, d.orden, d.activo, d.regalable, id]
  );
}

// Cambia la foto de un servicio (o la quita con null)
export async function cambiarFotoServicio(id: number, foto_id: number | null) {
  await db.execute("UPDATE servicios SET foto_id = ? WHERE id = ?", [foto_id, id]);
}

export async function cambiarActivo(id: number, activo: boolean) {
  await db.execute("UPDATE servicios SET activo = ? WHERE id = ?", [activo, id]);
}

export async function borrarServicio(id: number) {
  await db.execute("DELETE FROM servicios WHERE id = ?", [id]);
}

export interface ServicioRegalo {
  id: number;
  foto_id: number | null;
  nombre: string;
  descripcion: string;
  duracion_min: number | null;
  precio: number;
  categoria: string | null; // slug
}

// Servicios que se pueden comprar como bono regalo: activos, con precio y marcados como "se puede regalar"
export async function listarServiciosParaRegalo(): Promise<ServicioRegalo[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT s.id, s.foto_id, s.nombre, s.descripcion, s.duracion_min, s.precio, c.slug AS categoria
       FROM servicios s
       LEFT JOIN categorias c ON c.id = s.categoria_id
      WHERE s.activo = TRUE AND s.regalable = TRUE AND s.precio IS NOT NULL
      ${ORDEN}`
  );
  // mysql2 devuelve DECIMAL como texto: lo convertimos a número
  return rows.map((f) => ({ id: f.id, foto_id: f.foto_id, nombre: f.nombre, descripcion: f.descripcion, duracion_min: f.duracion_min, precio: Number(f.precio), categoria: f.categoria }));
}
