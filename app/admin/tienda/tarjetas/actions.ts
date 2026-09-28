"use server";
// Acciones del panel para las tarjetas regalo
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as fotos from "@/lib/fotos";
import * as tarjetas from "@/lib/tarjetas";
import { requireSession } from "@/lib/session";
import type { EstadoFormulario } from "../../actions";
import { comprobarId, leerImagenOpcional, valoresDe } from "../../utilidades";

function leerFormulario(formData: FormData): tarjetas.DatosTarjeta | string {
  const nombre = String(formData.get("nombre") ?? "").trim() || "Tarjeta regalo";
  const importe = Number(String(formData.get("importe") ?? "").trim().replace(",", "."));
  const orden = Number(String(formData.get("orden") ?? "").trim() || "0");

  if (nombre.length > 80) return "El nombre no puede tener más de 80 caracteres.";
  if (!Number.isFinite(importe) || importe < 5 || importe > 2000) return "El importe tiene que estar entre 5 y 2000 €.";
  if (!Number.isInteger(orden)) return "El orden debe ser un número entero.";

  return { nombre, importe, orden, activo: formData.get("activo") === "on" };
}

export async function crearTarjeta(_prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };
  const imagen = await leerImagenOpcional(formData.get("imagen"));
  if (typeof imagen === "string") return { error: imagen, valores: valoresDe(formData) };

  const id = await tarjetas.crearTarjeta(datos);
  if (imagen) await tarjetas.cambiarFotoTarjeta(id, await fotos.crearImagenInterna(`${datos.nombre} ${datos.importe} €`, "tarjeta", imagen));
  revalidatePath("/", "layout");
  redirect("/admin/tienda");
}

export async function editarTarjeta(id: number, _prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };

  const tarjeta = await tarjetas.obtenerTarjeta(comprobarId(id));
  if (!tarjeta) return { error: "Esta tarjeta ya no existe." };

  // Diseño: foto nueva, quitarla o dejar la que había
  const imagen = await leerImagenOpcional(formData.get("imagen"));
  if (typeof imagen === "string") return { error: imagen, valores: valoresDe(formData) };
  if (imagen || formData.get("quitar_imagen") === "on") {
    await tarjetas.cambiarFotoTarjeta(id, imagen ? await fotos.crearImagenInterna(`${datos.nombre} ${datos.importe} €`, "tarjeta", imagen) : null);
    if (tarjeta.foto_id) await fotos.borrarImagenInterna(tarjeta.foto_id);
  }

  await tarjetas.actualizarTarjeta(id, datos);
  revalidatePath("/", "layout");
  redirect("/admin/tienda");
}

export async function alternarActivoTarjeta(id: number, activo: boolean) {
  await requireSession();
  await tarjetas.cambiarActivoTarjeta(comprobarId(id), activo === true);
  revalidatePath("/", "layout");
}

export async function borrarTarjeta(id: number) {
  await requireSession();
  const tarjeta = await tarjetas.obtenerTarjeta(comprobarId(id));
  await tarjetas.borrarTarjeta(id);
  if (tarjeta?.foto_id) await fotos.borrarImagenInterna(tarjeta.foto_id);
  revalidatePath("/", "layout");
}
