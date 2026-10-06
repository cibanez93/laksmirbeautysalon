// Pedidos de la tienda: comprobar el carrito, reservar stock y plazas, confirmar el pago y cancelar.
// IMPORTANTE: los precios SIEMPRE se leen de la base de datos. El carrito viene del navegador
// y se podría manipular, así que de él solo usamos qué artículos son y cuántos.
import "server-only";
import { randomInt } from "node:crypto";
import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db } from "./db";
import { MESES_CADUCIDAD, envio } from "./tienda";

export type TipoLinea = "bono" | "tarjeta" | "producto" | "curso";

export interface LineaPedido {
  tipo: TipoLinea;
  ref_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Pedido {
  id: number;
  estado: "pendiente" | "pagado" | "cancelado";
  entrega: "recogida" | "envio" | "digital";
  nombre: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  regalo_para: string | null;
  regalo_de: string | null;
  regalo_mensaje: string | null;
  subtotal: number;
  gastos_envio: number;
  total: number;
  stripe_sesion: string | null;
  entregado: boolean;
  creado_en: Date;
  pagado_en: Date | null;
}

export interface Bono {
  id: number;
  codigo: string;
  pedido_id: number;
  tipo: "bono" | "tarjeta";
  descripcion: string;
  importe: number;
  caduca_en: string; // "2027-10-07"
  usado_en: Date | null;
}

const MAX_POR_ARTICULO = 10;

// ---------------------------------------------------------------------------
// 1. Comprobar el carrito con los datos reales de la base de datos
// ---------------------------------------------------------------------------

// Devuelve las líneas con nombre y precio de la base de datos, o un texto con el error
export async function prepararLineas(articulos: { id: string; cantidad: number }[]): Promise<LineaPedido[] | string> {
  if (articulos.length === 0) return "El carrito está vacío.";
  if (articulos.length > 30) return "Hay demasiados artículos en el carrito.";

  const lineas: LineaPedido[] = [];
  for (const a of articulos) {
    const coincide = /^(bono|tarjeta|producto|curso)-(\d+)$/.exec(String(a.id));
    if (!coincide) return "Hay un artículo de ejemplo en el carrito. Quítalo para poder pagar.";
    const tipo = coincide[1] as TipoLinea;
    const ref_id = Number(coincide[2]);
    const cantidad = Number(a.cantidad);
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_POR_ARTICULO) return "Revisa las cantidades del carrito.";

    const linea = await leerArticulo(tipo, ref_id);
    if (typeof linea === "string") return linea;
    lineas.push({ ...linea, cantidad });
  }
  return lineas;
}

async function leerArticulo(tipo: TipoLinea, id: number): Promise<Omit<LineaPedido, "cantidad"> | string> {
  const fila = async (sql: string) => (await db.execute<RowDataPacket[]>(sql, [id]))[0][0];

  if (tipo === "producto") {
    const p = await fila("SELECT nombre, precio FROM productos WHERE id = ? AND activo = TRUE");
    if (!p) return "Un producto del carrito ya no está a la venta. Quítalo para poder pagar.";
    return { tipo, ref_id: id, nombre: p.nombre, precio: Number(p.precio) };
  }
  if (tipo === "tarjeta") {
    const t = await fila("SELECT nombre, importe FROM tarjetas_regalo WHERE id = ? AND activo = TRUE");
    if (!t) return "Una tarjeta regalo del carrito ya no está disponible. Quítala para poder pagar.";
    const importe = Number(t.importe);
    return { tipo, ref_id: id, nombre: `${t.nombre} de ${importe.toLocaleString("es-ES")} €`, precio: importe };
  }
  if (tipo === "bono") {
    const s = await fila("SELECT nombre, precio FROM servicios WHERE id = ? AND activo = TRUE AND regalable = TRUE AND precio > 0");
    if (!s) return "Un bono regalo del carrito ya no está disponible. Quítalo para poder pagar.";
    return { tipo, ref_id: id, nombre: `Bono regalo: ${s.nombre}`, precio: Number(s.precio) };
  }
  // Cursos: de momento solo los presenciales que todavía no han pasado
  const c = await fila("SELECT nombre, precio FROM cursos WHERE id = ? AND activo = TRUE AND formato = 'presencial' AND fecha > NOW()");
  if (!c) return "Un curso del carrito ya no está disponible. Quítalo para poder pagar.";
  return { tipo, ref_id: id, nombre: `Curso: ${c.nombre}`, precio: Number(c.precio) };
}

// Total del pedido. Los gastos de envío solo cuentan si hay productos y se eligió envío.
export function calcularTotales(lineas: LineaPedido[], quiereEnvio: boolean) {
  const subtotal = redondear(lineas.reduce((s, l) => s + l.precio * l.cantidad, 0));
  const productos = lineas.filter((l) => l.tipo === "producto").reduce((s, l) => s + l.precio * l.cantidad, 0);
  const hayProductos = lineas.some((l) => l.tipo === "producto");
  const entrega: Pedido["entrega"] = !hayProductos ? "digital" : quiereEnvio ? "envio" : "recogida";
  const gastos_envio = entrega === "envio" && productos < envio.gratisDesde ? envio.precio : 0;
  return { entrega, subtotal, gastos_envio, total: redondear(subtotal + gastos_envio) };
}

const redondear = (n: number) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------------------
// 2. Crear el pedido y reservar stock y plazas (todo o nada)
// ---------------------------------------------------------------------------

// Ejecuta varias órdenes como una sola: si algo falla, no se guarda nada (transacción)
async function enTransaccion<T>(trabajo: (con: PoolConnection) => Promise<T>): Promise<T> {
  const con = await db.getConnection();
  try {
    await con.beginTransaction();
    const resultado = await trabajo(con);
    await con.commit();
    return resultado;
  } catch (error) {
    await con.rollback();
    throw error;
  } finally {
    con.release();
  }
}

class SinExistencias extends Error {}

export async function crearPedido(
  lineas: LineaPedido[],
  datos: { quiereEnvio: boolean; regalo_para: string; regalo_de: string; regalo_mensaje: string }
): Promise<{ id: number; totales: ReturnType<typeof calcularTotales> } | string> {
  const totales = calcularTotales(lineas, datos.quiereEnvio);
  try {
    const id = await enTransaccion(async (con) => {
      const [res] = await con.execute<ResultSetHeader>(
        `INSERT INTO pedidos (entrega, regalo_para, regalo_de, regalo_mensaje, subtotal, gastos_envio, total)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [totales.entrega, datos.regalo_para || null, datos.regalo_de || null, datos.regalo_mensaje || null, totales.subtotal, totales.gastos_envio, totales.total]
      );
      for (const l of lineas) {
        await con.execute("INSERT INTO pedido_lineas (pedido_id, tipo, ref_id, nombre, precio, cantidad) VALUES (?, ?, ?, ?, ?, ?)", [
          res.insertId, l.tipo, l.ref_id, l.nombre, l.precio, l.cantidad,
        ]);
        // Reservar: solo baja si hay suficientes. Si dos personas compran a la vez, solo una lo consigue.
        if (l.tipo === "producto" || l.tipo === "curso") {
          const sql = l.tipo === "producto"
            ? "UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?"
            : "UPDATE cursos SET plazas_libres = plazas_libres - ? WHERE id = ? AND plazas_libres >= ?";
          const [r] = await con.execute<ResultSetHeader>(sql, [l.cantidad, l.ref_id, l.cantidad]);
          if (r.affectedRows === 0) throw new SinExistencias(l.nombre);
        }
      }
      return res.insertId;
    });
    return { id, totales };
  } catch (error) {
    if (error instanceof SinExistencias) {
      return `No quedan suficientes unidades de «${error.message.replace(/^Curso: /, "")}». Baja la cantidad o quítalo del carrito.`;
    }
    throw error;
  }
}

export async function guardarSesionStripe(pedidoId: number, sesion: string) {
  await db.execute("UPDATE pedidos SET stripe_sesion = ? WHERE id = ?", [sesion, pedidoId]);
}

// ---------------------------------------------------------------------------
// 3. Stripe confirma el pago: pedido pagado y bonos con código
// ---------------------------------------------------------------------------

// Sin letras que se confunden (O/0, I/1): más fácil de dictar por teléfono
const LETRAS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nuevoCodigo = () => Array.from({ length: 10 }, () => LETRAS[randomInt(LETRAS.length)]).join("");

export async function confirmarPago(
  pedidoId: number,
  cliente: { nombre: string | null; email: string | null; telefono: string | null; direccion: string | null }
) {
  await enTransaccion(async (con) => {
    // Solo si sigue pendiente: Stripe puede avisar dos veces del mismo pago
    const [res] = await con.execute<ResultSetHeader>(
      `UPDATE pedidos SET estado = 'pagado', pagado_en = NOW(), nombre = ?, email = ?, telefono = ?, direccion = ?
        WHERE id = ? AND estado = 'pendiente'`,
      [cliente.nombre, cliente.email, cliente.telefono, cliente.direccion, pedidoId]
    );
    if (res.affectedRows === 0) return;

    const [lineas] = await con.execute<RowDataPacket[]>(
      "SELECT tipo, nombre, precio, cantidad FROM pedido_lineas WHERE pedido_id = ? AND tipo IN ('bono', 'tarjeta')",
      [pedidoId]
    );
    for (const l of lineas) {
      for (let i = 0; i < l.cantidad; i++) {
        await con.execute(
          `INSERT INTO bonos (codigo, pedido_id, tipo, descripcion, importe, caduca_en)
           VALUES (?, ?, ?, ?, ?, DATE_ADD(CURDATE(), INTERVAL ${MESES_CADUCIDAD} MONTH))`,
          [nuevoCodigo(), pedidoId, l.tipo, l.nombre, l.precio]
        );
      }
    }
  });
}

// La clienta no pagó (la página de pago de Stripe caducó): se cancela y se devuelve el stock y las plazas
export async function cancelarPedido(pedidoId: number) {
  await enTransaccion(async (con) => {
    const [res] = await con.execute<ResultSetHeader>("UPDATE pedidos SET estado = 'cancelado' WHERE id = ? AND estado = 'pendiente'", [pedidoId]);
    if (res.affectedRows === 0) return;
    await con.execute(
      `UPDATE productos p JOIN pedido_lineas l ON l.tipo = 'producto' AND l.ref_id = p.id
          SET p.stock = p.stock + l.cantidad WHERE l.pedido_id = ?`,
      [pedidoId]
    );
    await con.execute(
      `UPDATE cursos c JOIN pedido_lineas l ON l.tipo = 'curso' AND l.ref_id = c.id
          SET c.plazas_libres = c.plazas_libres + l.cantidad WHERE l.pedido_id = ?`,
      [pedidoId]
    );
  });
}

// ---------------------------------------------------------------------------
// 4. Consultas para la página de «Gracias» y el panel
// ---------------------------------------------------------------------------

const aPedido = (f: RowDataPacket): Pedido => ({
  ...(f as Pedido),
  subtotal: Number(f.subtotal),
  gastos_envio: Number(f.gastos_envio),
  total: Number(f.total),
  entregado: Boolean(f.entregado),
});

const aBono = (f: RowDataPacket): Bono => ({
  id: f.id,
  codigo: f.codigo,
  pedido_id: f.pedido_id,
  tipo: f.tipo,
  descripcion: f.descripcion,
  importe: Number(f.importe),
  caduca_en: f.caduca_en,
  usado_en: f.usado_en,
});

const COLUMNAS_BONO = "id, codigo, pedido_id, tipo, descripcion, importe, DATE_FORMAT(caduca_en, '%Y-%m-%d') AS caduca_en, usado_en";

export async function obtenerPedido(id: number) {
  const [[fila]] = await db.execute<RowDataPacket[]>("SELECT * FROM pedidos WHERE id = ?", [id]);
  if (!fila) return null;
  const [lineas] = await db.execute<RowDataPacket[]>("SELECT tipo, ref_id, nombre, precio, cantidad FROM pedido_lineas WHERE pedido_id = ? ORDER BY id", [id]);
  const [bonos] = await db.execute<RowDataPacket[]>(`SELECT ${COLUMNAS_BONO} FROM bonos WHERE pedido_id = ? ORDER BY id`, [id]);
  return {
    pedido: aPedido(fila),
    lineas: lineas.map((l) => ({ ...(l as LineaPedido), precio: Number(l.precio) })),
    bonos: bonos.map(aBono),
  };
}

// Para el panel: los pagados primero; los pendientes de menos de un día también (por si alguien está pagando)
export async function listarPedidos() {
  const [filas] = await db.query<RowDataPacket[]>(
    `SELECT * FROM pedidos
      WHERE estado = 'pagado' OR (estado = 'pendiente' AND creado_en > NOW() - INTERVAL 1 DAY)
      ORDER BY COALESCE(pagado_en, creado_en) DESC LIMIT 200`
  );
  const pedidos = filas.map(aPedido);
  if (pedidos.length === 0) return [];
  const ids = pedidos.map((p) => p.id);
  const [lineas] = await db.query<RowDataPacket[]>("SELECT pedido_id, tipo, nombre, precio, cantidad FROM pedido_lineas WHERE pedido_id IN (?) ORDER BY id", [ids]);
  return pedidos.map((p) => ({
    ...p,
    lineas: lineas.filter((l) => l.pedido_id === p.id).map((l) => ({ ...(l as LineaPedido), precio: Number(l.precio) })),
  }));
}

export async function marcarEntregado(id: number, entregado: boolean) {
  await db.execute("UPDATE pedidos SET entregado = ? WHERE id = ? AND estado = 'pagado'", [entregado, id]);
}

// Bonos: buscar por código (para canjear en el salón) o ver los últimos
export async function buscarBono(codigo: string): Promise<Bono | null> {
  const [[fila]] = await db.execute<RowDataPacket[]>(`SELECT ${COLUMNAS_BONO} FROM bonos WHERE codigo = ?`, [codigo]);
  return fila ? aBono(fila) : null;
}

export async function listarBonos(): Promise<Bono[]> {
  const [filas] = await db.query<RowDataPacket[]>(`SELECT ${COLUMNAS_BONO} FROM bonos ORDER BY usado_en IS NOT NULL, creado_en DESC LIMIT 200`);
  return filas.map(aBono);
}

export async function cambiarUsoBono(id: number, usado: boolean) {
  await db.execute(`UPDATE bonos SET usado_en = ${usado ? "NOW()" : "NULL"} WHERE id = ?`, [id]);
}

// Alumnas apuntadas a un curso (pedidos pagados)
export async function alumnasDeCurso(cursoId: number) {
  const [filas] = await db.execute<RowDataPacket[]>(
    `SELECT p.id AS pedido_id, p.nombre, p.email, p.telefono, l.cantidad, p.pagado_en
       FROM pedido_lineas l JOIN pedidos p ON p.id = l.pedido_id
      WHERE l.tipo = 'curso' AND l.ref_id = ? AND p.estado = 'pagado'
      ORDER BY p.pagado_en`,
    [cursoId]
  );
  return filas as { pedido_id: number; nombre: string | null; email: string | null; telefono: string | null; cantidad: number; pagado_en: Date }[];
}
