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
import { comprobarId, valoresDe } from "./utilidades";

// "valores" devuelve lo que se escribió, para no vaciar el formulario si hay un error
export type EstadoFormulario = { error?: string; valores?: Record<string, string> } | undefined;

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
  const categoriaTxt = String(formData.get("categoria_id") ?? "").trim();
  const duracionTxt = String(formData.get("duracion_min") ?? "").trim();
  const ordenTxt = String(formData.get("orden") ?? "").trim();

  if (!nombre) return "El nombre es obligatorio.";
  if (nombre.length > 100) return "El nombre no puede tener más de 100 caracteres.";
  if (!descripcion) return "La descripción es obligatoria.";

  const categoria_id = Number(categoriaTxt);
  if (!Number.isInteger(categoria_id) || categoria_id <= 0) return "Elige una categoría.";

  const duracion_min = duracionTxt === "" ? null : Number(duracionTxt);
  if (duracion_min !== null && (!Number.isInteger(duracion_min) || duracion_min <= 0 || duracion_min > 1440)) {
    return "La duración debe ser un número de minutos entre 1 y 1440.";
  }

  const orden = ordenTxt === "" ? 0 : Number(ordenTxt);
  if (!Number.isInteger(orden)) return "El orden debe ser un número entero.";

  return { categoria_id, nombre, descripcion, duracion_min, orden, activo: formData.get("activo") === "on" };
}

// Después de cambiar algo, pedimos a Next que regenere la web y el panel
function refrescar() {
  revalidatePath("/", "layout");
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
