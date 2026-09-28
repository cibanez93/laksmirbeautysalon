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
import * as fotos from "@/lib/fotos";
import * as servicios from "@/lib/servicios";
import { comprobarId, leerImagenOpcional, valoresDe } from "./utilidades";

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
  const precioTxt = String(formData.get("precio") ?? "").trim().replace(",", ".");

  if (!nombre) return "El nombre es obligatorio.";
  if (nombre.length > 100) return "El nombre no puede tener más de 100 caracteres.";

  const categoria_id = Number(categoriaTxt);
  if (!Number.isInteger(categoria_id) || categoria_id <= 0) return "Elige una categoría.";

  const duracion_min = duracionTxt === "" ? null : Number(duracionTxt);
  if (duracion_min !== null && (!Number.isInteger(duracion_min) || duracion_min <= 0 || duracion_min > 1440)) {
    return "La duración debe ser un número de minutos entre 1 y 1440.";
  }

  const orden = ordenTxt === "" ? 0 : Number(ordenTxt);
  if (!Number.isInteger(orden)) return "El orden debe ser un número entero.";

  const precio = precioTxt === "" ? null : Number(precioTxt);
  if (precio !== null && (!Number.isFinite(precio) || precio <= 0 || precio > 9999)) return "El precio debe ser un número entre 0 y 9999.";

  const regalable = formData.get("regalable") === "on";
  if (regalable && precio === null) return "Para poder regalar el servicio, ponle un precio.";

  return { categoria_id, nombre, descripcion, duracion_min, precio, orden, activo: formData.get("activo") === "on", regalable };
}

// Después de cambiar algo, pedimos a Next que regenere la web y el panel
function refrescar() {
  revalidatePath("/", "layout");
}

// Guarda la foto del servicio: una nueva, quitarla o dejar la que había
async function guardarFotoServicio(id: number, nombre: string, formData: FormData, fotoAnterior: number | null): Promise<string | null> {
  const imagen = await leerImagenOpcional(formData.get("imagen"));
  if (typeof imagen === "string") return imagen;
  const quitar = formData.get("quitar_imagen") === "on";
  if (!imagen && !quitar) return null; // sin cambios

  const nueva = imagen ? await fotos.crearImagenInterna(nombre, "servicio", imagen) : null;
  await servicios.cambiarFotoServicio(id, nueva);
  if (fotoAnterior) await fotos.borrarImagenInterna(fotoAnterior); // la vieja ya no se usa
  return null;
}

export async function crearServicio(_prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };

  const imagen = await leerImagenOpcional(formData.get("imagen"));
  if (typeof imagen === "string") return { error: imagen, valores: valoresDe(formData) };

  const id = await servicios.crearServicio(datos);
  if (imagen) await servicios.cambiarFotoServicio(id, await fotos.crearImagenInterna(datos.nombre, "servicio", imagen));
  refrescar();
  redirect("/admin");
}

export async function editarServicio(id: number, _prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };

  const servicio = await servicios.obtenerServicio(comprobarId(id));
  if (!servicio) return { error: "Este servicio ya no existe." };

  const errorFoto = await guardarFotoServicio(id, datos.nombre, formData, servicio.foto_id);
  if (errorFoto) return { error: errorFoto, valores: valoresDe(formData) };

  await servicios.actualizarServicio(id, datos);
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
  const servicio = await servicios.obtenerServicio(comprobarId(id));
  await servicios.borrarServicio(id);
  if (servicio?.foto_id) await fotos.borrarImagenInterna(servicio.foto_id);
  refrescar();
}
