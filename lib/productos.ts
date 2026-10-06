// Consultas a la tabla "productos" de la tienda
import "server-only";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "./db";

export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  descripcion: string;
  precio: number;
  stock: number;
  foto_id: number | null;
  activo: boolean;
  orden: number;
}

export type DatosProducto = Omit<Producto, "id" | "foto_id">;

const COLUMNAS = "id, nombre, marca, descripcion, precio, stock, foto_id, activo, orden";

// mysql2 devuelve DECIMAL como texto y BOOLEAN como 0/1: los convertimos
const aProducto = (f: RowDataPacket): Producto => ({
  id: f.id,
  nombre: f.nombre,
  marca: f.marca,
  descripcion: f.descripcion,
  precio: Number(f.precio),
  stock: f.stock,
  foto_id: f.foto_id,
  activo: Boolean(f.activo),
  orden: f.orden,
});

// Para la tienda: solo los activos (los agotados también salen, marcados como agotados)
export async function listarProductosActivos(): Promise<Producto[]> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT ${COLUMNAS} FROM productos WHERE activo = TRUE ORDER BY orden, id`);
  return rows.map(aProducto);
}

// Para el panel: todos
export async function listarProductos(): Promise<Producto[]> {
  const [rows] = await db.query<RowDataPacket[]>(`SELECT ${COLUMNAS} FROM productos ORDER BY orden, id`);
  return rows.map(aProducto);
}

export async function obtenerProducto(id: number): Promise<(Producto & { version: number }) | null> {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT ${COLUMNAS}, UNIX_TIMESTAMP(actualizado_en) AS version FROM productos WHERE id = ?`,
    [id]
  );
  return rows[0] ? { ...aProducto(rows[0]), version: Number(rows[0].version) } : null;
}

export async function crearProducto(d: DatosProducto): Promise<number> {
  const [res] = await db.execute<ResultSetHeader>(
    "INSERT INTO productos (nombre, marca, descripcion, precio, stock, activo, orden) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [d.nombre, d.marca, d.descripcion, d.precio, d.stock, d.activo, d.orden]
  );
  return res.insertId;
}

export async function actualizarProducto(id: number, d: DatosProducto) {
  await db.execute(
    "UPDATE productos SET nombre = ?, marca = ?, descripcion = ?, precio = ?, stock = ?, activo = ?, orden = ? WHERE id = ?",
    [d.nombre, d.marca, d.descripcion, d.precio, d.stock, d.activo, d.orden, id]
  );
}

export async function cambiarFotoProducto(id: number, foto_id: number | null) {
  await db.execute("UPDATE productos SET foto_id = ? WHERE id = ?", [foto_id, id]);
}

export async function restarStock(id: number, cantidad: number) {
  await db.execute("UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?", [cantidad, id, cantidad]);
}

export async function cambiarActivoProducto(id: number, activo: boolean) {
  await db.execute("UPDATE productos SET activo = ? WHERE id = ?", [activo, id]);
}

export async function borrarProducto(id: number) {
  await db.execute("DELETE FROM productos WHERE id = ?", [id]);
}
