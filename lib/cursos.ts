// Consultas a la tabla "cursos" de Laksmir Academy
import "server-only";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Curso, Formato, Publico } from "./academia";
import { db } from "./db";

export interface CursoBD {
  id: number;
  nombre: string;
  publico: Publico;
  formato: Formato;
  descripcion: string;
  incluye: string; // una cosa por línea
  duracion: string;
  fecha: string | null; // "2026-11-14T10:00" (hora de Pamplona), como la escribe el panel
  plazas: number | null;
  plazas_libres: number | null;
  precio: number;
  foto_id: number | null;
  activo: boolean;
  orden: number;
}

export type DatosCurso = Omit<CursoBD, "id" | "foto_id">;

// La fecha se lee como texto para que no cambie de hora (el servidor puede estar en otra zona horaria)
const COLUMNAS = `id, nombre, publico, formato, descripcion, incluye, duracion,
  DATE_FORMAT(fecha, '%Y-%m-%dT%H:%i') AS fecha, plazas, plazas_libres, precio, foto_id, activo, orden`;

const aCurso = (f: RowDataPacket): CursoBD => ({
  id: f.id,
  nombre: f.nombre,
  publico: f.publico,
  formato: f.formato,
  descripcion: f.descripcion,
  incluye: f.incluye,
  duracion: f.duracion,
  fecha: f.fecha,
  plazas: f.plazas,
  plazas_libres: f.plazas_libres,
  precio: Number(f.precio),
  foto_id: f.foto_id,
  activo: Boolean(f.activo),
  orden: f.orden,
});

// "2026-11-14T10:00" -> "Sábado 14 de noviembre · 10:00"
export function fechaBonita(fecha: string) {
  const [dia, hora] = fecha.split("T");
  const texto = new Date(`${dia}T12:00:00Z`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).replace(",", "");
  return `${texto.charAt(0).toUpperCase()}${texto.slice(1)} · ${hora}`;
}

// Para la web: lo que necesita la tarjeta del curso
export const aCursoWeb = (c: CursoBD): Curso => ({
  slug: String(c.id),
  nombre: c.nombre,
  publico: c.publico,
  formato: c.formato,
  descripcion: c.descripcion,
  incluye: c.incluye.split("\n").map((l) => l.trim()).filter(Boolean),
  duracion: c.duracion,
  fecha: c.fecha ? fechaBonita(c.fecha) : undefined,
  plazas: c.plazas ?? undefined,
  plazasLibres: c.plazas_libres ?? undefined,
  precio: c.precio,
  fotoId: c.foto_id,
});

// Para la web: los visibles. Los presenciales que ya han pasado no salen.
export async function listarCursosActivos(): Promise<CursoBD[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT ${COLUMNAS} FROM cursos
      WHERE activo = TRUE AND (fecha IS NULL OR fecha >= CURDATE())
      ORDER BY orden, fecha IS NULL, fecha, id`
  );
  return rows.map(aCurso);
}

// Para el panel: todos
export async function listarCursos(): Promise<CursoBD[]> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT ${COLUMNAS} FROM cursos ORDER BY orden, fecha IS NULL, fecha, id`);
  return rows.map(aCurso);
}

export async function obtenerCurso(id: number): Promise<(CursoBD & { version: number }) | null> {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT ${COLUMNAS}, UNIX_TIMESTAMP(actualizado_en) AS version FROM cursos WHERE id = ?`,
    [id]
  );
  return rows[0] ? { ...aCurso(rows[0]), version: Number(rows[0].version) } : null;
}

const valores = (d: DatosCurso) => [
  d.nombre, d.publico, d.formato, d.descripcion, d.incluye, d.duracion,
  d.fecha ? d.fecha.replace("T", " ") : null, d.plazas, d.plazas_libres, d.precio, d.activo, d.orden,
];

export async function crearCurso(d: DatosCurso): Promise<number> {
  const [res] = await db.execute<ResultSetHeader>(
    `INSERT INTO cursos (nombre, publico, formato, descripcion, incluye, duracion, fecha, plazas, plazas_libres, precio, activo, orden)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    valores(d)
  );
  return res.insertId;
}

export async function actualizarCurso(id: number, d: DatosCurso) {
  await db.execute(
    `UPDATE cursos SET nombre = ?, publico = ?, formato = ?, descripcion = ?, incluye = ?, duracion = ?,
            fecha = ?, plazas = ?, plazas_libres = ?, precio = ?, activo = ?, orden = ?
      WHERE id = ?`,
    [...valores(d), id]
  );
}

export async function cambiarFotoCurso(id: number, foto_id: number | null) {
  await db.execute("UPDATE cursos SET foto_id = ? WHERE id = ?", [foto_id, id]);
}

export async function cambiarActivoCurso(id: number, activo: boolean) {
  await db.execute("UPDATE cursos SET activo = ? WHERE id = ?", [activo, id]);
}

export async function borrarCurso(id: number) {
  await db.execute("DELETE FROM cursos WHERE id = ?", [id]);
}
