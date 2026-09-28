// Consultas a la tabla "fotos" de la galería.
// Las imágenes se guardan dentro de la base de datos (columnas MEDIUMBLOB) y se sirven
// desde /fotos/[id] y /fotos/[id]/antes (ver app/fotos).
import "server-only";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "./db";

export type TipoFoto = "foto" | "antes_despues";
export type FormaFoto = "cuadrada" | "vertical" | "horizontal";

export interface Foto {
  id: number;
  titulo: string;
  categoria: string | null; // nombre de la categoría
  tipo: TipoFoto;
  forma: FormaFoto;
  visible: boolean;
}

// Dirección pública de cada imagen
export const urlFoto = (id: number) => `/fotos/${id}`;
export const urlFotoAntes = (id: number) => `/fotos/${id}/antes`;

// Ojo: aquí NO se piden las columnas de imagen, que pesan mucho. Solo los datos.
export async function listarFotos({ soloVisibles }: { soloVisibles: boolean }): Promise<Foto[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT f.id, f.titulo, c.nombre AS categoria, f.tipo, f.forma, f.visible
       FROM fotos f
       LEFT JOIN categorias c ON c.id = f.categoria_id
      ${soloVisibles ? "WHERE f.visible = TRUE" : ""}
      ORDER BY f.creado_en DESC, f.id DESC`
  );
  return rows.map((f) => ({ id: f.id, titulo: f.titulo, categoria: f.categoria, tipo: f.tipo, forma: f.forma, visible: Boolean(f.visible) }));
}

// Una foto con su categoria_id, para el formulario de editar
export async function obtenerFoto(id: number): Promise<(Foto & { categoria_id: number | null; version: number }) | null> {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT f.id, f.titulo, f.categoria_id, c.nombre AS categoria, f.tipo, f.forma, f.visible, UNIX_TIMESTAMP(f.actualizado_en) AS version
       FROM fotos f LEFT JOIN categorias c ON c.id = f.categoria_id WHERE f.id = ?`,
    [id]
  );
  const f = rows[0];
  return f
    ? { id: f.id, titulo: f.titulo, categoria_id: f.categoria_id, categoria: f.categoria, tipo: f.tipo, forma: f.forma, visible: Boolean(f.visible), version: Number(f.version) }
    : null;
}

export async function obtenerImagen(id: number, parte: "imagen" | "imagen_antes"): Promise<Buffer | null> {
  // "parte" solo puede ser una de las dos columnas: nunca viene escrito por el usuario
  const [rows] = await db.execute<RowDataPacket[]>(`SELECT ${parte} AS datos FROM fotos WHERE id = ?`, [id]);
  return rows[0]?.datos ?? null;
}

export async function crearFoto(d: {
  titulo: string;
  categoria_id: number | null;
  tipo: TipoFoto;
  forma: FormaFoto;
  imagen: Buffer;
  imagen_antes: Buffer | null;
}): Promise<number> {
  const [res] = await db.execute<ResultSetHeader>(
    "INSERT INTO fotos (titulo, categoria_id, tipo, forma, imagen, imagen_antes) VALUES (?, ?, ?, ?, ?, ?)",
    [d.titulo, d.categoria_id, d.tipo, d.forma, d.imagen, d.imagen_antes]
  );
  return res.insertId;
}

// Cambia los datos de una foto. Las imágenes solo se cambian si se envía una nueva.
export async function actualizarFoto(
  id: number,
  d: { titulo: string; categoria_id: number | null; forma: FormaFoto; imagen: Buffer | null; imagen_antes: Buffer | null }
) {
  await db.execute("UPDATE fotos SET titulo = ?, categoria_id = ?, forma = ? WHERE id = ?", [d.titulo, d.categoria_id, d.forma, id]);
  if (d.imagen) await db.execute("UPDATE fotos SET imagen = ? WHERE id = ?", [d.imagen, id]);
  if (d.imagen_antes) await db.execute("UPDATE fotos SET imagen_antes = ? WHERE id = ? AND tipo = 'antes_despues'", [d.imagen_antes, id]);
}

export async function cambiarVisibleFoto(id: number, visible: boolean) {
  await db.execute("UPDATE fotos SET visible = ? WHERE id = ?", [visible, id]);
}

export async function borrarFoto(id: number) {
  await db.execute("DELETE FROM fotos WHERE id = ?", [id]);
}
