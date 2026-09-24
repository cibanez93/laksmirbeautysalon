"use server";
// Acciones del servidor del panel. Se ejecutan SIEMPRE en el servidor,
// pero cualquiera puede llamarlas con una petición POST, así que cada una
// comprueba la sesión antes de tocar la base de datos.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession, deleteSession, requireSession } from "@/lib/session";
import * as servicios from "@/lib/servicios";

// "valores" devuelve lo que se escribió, para no vaciar el formulario si hay un error
export type EstadoFormulario = { error?: string; valores?: Record<string, string> } | undefined;

const valoresDe = (formData: FormData) =>
  Object.fromEntries([...formData].filter(([k, v]) => !k.startsWith("$") && typeof v === "string")) as Record<string, string>;

// ---------------------------------------------------------------- Login

export async function login(_prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Escribe tu email y tu contraseña.", valores: { email } };

  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT id, password_hash FROM usuarios WHERE email = ?",
    [email]
  );
  const usuario = rows[0];

  // Mismo mensaje si falla el email o la contraseña: así no damos pistas
  if (!usuario || !(await verifyPassword(password, usuario.password_hash))) {
    return { error: "Email o contraseña incorrectos.", valores: { email } };
  }

  await createSession(usuario.id);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- Servicios

// Lee y valida los campos del formulario de servicio
function leerFormulario(formData: FormData): servicios.DatosServicio | string {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const precioTxt = String(formData.get("precio") ?? "").trim().replace(",", ".");
  const duracionTxt = String(formData.get("duracion_min") ?? "").trim();
  const ordenTxt = String(formData.get("orden") ?? "").trim();

  if (!nombre) return "El nombre es obligatorio.";
  if (nombre.length > 100) return "El nombre no puede tener más de 100 caracteres.";
  if (!descripcion) return "La descripción es obligatoria.";

  const precio = precioTxt === "" ? null : Number(precioTxt);
  if (precio !== null && (!Number.isFinite(precio) || precio < 0 || precio > 9999)) {
    return "El precio debe ser un número entre 0 y 9999.";
  }

  const duracion_min = duracionTxt === "" ? null : Number(duracionTxt);
  if (duracion_min !== null && (!Number.isInteger(duracion_min) || duracion_min <= 0 || duracion_min > 1440)) {
    return "La duración debe ser un número de minutos entre 1 y 1440.";
  }

  const orden = ordenTxt === "" ? 0 : Number(ordenTxt);
  if (!Number.isInteger(orden)) return "El orden debe ser un número entero.";

  return { nombre, descripcion, precio, duracion_min, orden, activo: formData.get("activo") === "on" };
}

// Los argumentos llegan del navegador y se pueden manipular: comprobamos que el id es válido
function comprobarId(id: unknown): number {
  if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) throw new Error("Id no válido");
  return id;
}

// Después de cambiar algo, pedimos a Next que regenere la web y el panel
function refrescar() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function crearServicio(_prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };

  await servicios.crearServicio(datos);
  refrescar();
  redirect("/admin");
}

export async function editarServicio(id: number, _prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };

  await servicios.actualizarServicio(comprobarId(id), datos);
  refrescar();
  redirect("/admin");
}

export async function alternarActivo(id: number, activo: boolean) {
  await requireSession();
  await servicios.cambiarActivo(comprobarId(id), activo === true);
  refrescar();
}

export async function borrarServicio(id: number) {
  await requireSession();
  await servicios.borrarServicio(comprobarId(id));
  refrescar();
}
