// Consultas a la tabla "articulos" del blog
import "server-only";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Tema } from "./blog";
import { db } from "./db";

export interface Articulo {
  id: number;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  tema: Tema;
  autora: string;
  fecha: string; // AAAA-MM-DD
  publicado: boolean;
}

export type DatosArticulo = Omit<Articulo, "id" | "slug">;

// DATE_FORMAT devuelve la fecha como texto "2026-09-28" en vez de un objeto Date con hora
const COLUMNAS = "id, slug, titulo, resumen, contenido, tema, autora, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, publicado";

const aArticulo = (f: RowDataPacket): Articulo => ({
  id: f.id,
  slug: f.slug,
  titulo: f.titulo,
  resumen: f.resumen,
  contenido: f.contenido,
  tema: f.tema,
  autora: f.autora,
  fecha: f.fecha,
  publicado: Boolean(f.publicado),
});

// Para la web: solo los publicados y con fecha de hoy o anterior, del más nuevo al más antiguo
export async function listarPublicados(): Promise<Articulo[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT ${COLUMNAS} FROM articulos WHERE publicado = TRUE AND fecha <= CURDATE() ORDER BY fecha DESC, id DESC`
  );
  return rows.map(aArticulo);
}

export async function obtenerPublicado(slug: string): Promise<Articulo | null> {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT ${COLUMNAS} FROM articulos WHERE slug = ? AND publicado = TRUE AND fecha <= CURDATE()`,
    [slug]
  );
  return rows[0] ? aArticulo(rows[0]) : null;
}

// Para el panel: todos, también los borradores
export async function listarArticulos(): Promise<Articulo[]> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT ${COLUMNAS} FROM articulos ORDER BY fecha DESC, id DESC`);
  return rows.map(aArticulo);
}

export async function obtenerArticulo(id: number): Promise<Articulo | null> {
  const [rows] = await db.execute<RowDataPacket[]>(`SELECT ${COLUMNAS} FROM articulos WHERE id = ?`, [id]);
  return rows[0] ? aArticulo(rows[0]) : null;
}

export async function existeSlug(slug: string): Promise<boolean> {
  const [rows] = await db.execute<RowDataPacket[]>("SELECT 1 FROM articulos WHERE slug = ?", [slug]);
  return rows.length > 0;
}

export async function crearArticulo(slug: string, d: DatosArticulo): Promise<number> {
  const [res] = await db.execute<ResultSetHeader>(
    "INSERT INTO articulos (slug, titulo, resumen, contenido, tema, autora, fecha, publicado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [slug, d.titulo, d.resumen, d.contenido, d.tema, d.autora, d.fecha, d.publicado]
  );
  return res.insertId;
}

// El slug (la dirección web) no se cambia al editar: si cambiara, los enlaces antiguos dejarían de funcionar
export async function actualizarArticulo(id: number, d: DatosArticulo) {
  await db.execute(
    "UPDATE articulos SET titulo = ?, resumen = ?, contenido = ?, tema = ?, autora = ?, fecha = ?, publicado = ? WHERE id = ?",
    [d.titulo, d.resumen, d.contenido, d.tema, d.autora, d.fecha, d.publicado, id]
  );
}

export async function cambiarPublicado(id: number, publicado: boolean) {
  await db.execute("UPDATE articulos SET publicado = ? WHERE id = ?", [publicado, id]);
}

export async function borrarArticulo(id: number) {
  await db.execute("DELETE FROM articulos WHERE id = ?", [id]);
}
