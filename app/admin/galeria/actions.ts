"use server";
// Acciones del panel para la galería: subir, ocultar/mostrar y borrar fotos.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as fotos from "@/lib/fotos";
import { requireSession } from "@/lib/session";
import type { EstadoFormulario } from "../actions";
import { comprobarId, leerImagen, leerImagenOpcional, valoresDe } from "../utilidades";

// Lee y valida los campos comunes (título, categoría y forma). El título es opcional.
function leerDatos(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (titulo.length > 120) return "El título no puede tener más de 120 caracteres.";

  const formaTxt = String(formData.get("forma") ?? "cuadrada");
  const forma = (["cuadrada", "vertical", "horizontal"] as const).find((f) => f === formaTxt) ?? "cuadrada";

  const categoriaTxt = String(formData.get("categoria_id") ?? "");
  const categoria_id = categoriaTxt ? Number(categoriaTxt) : null;
  if (categoria_id !== null && (!Number.isInteger(categoria_id) || categoria_id <= 0)) return "Categoría no válida.";

  return { titulo, forma, categoria_id };
}

export async function subirFoto(_prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const valores = valoresDe(formData);

  const datos = leerDatos(formData);
  if (typeof datos === "string") return { error: datos, valores };
  const tipo = formData.get("tipo") === "antes_despues" ? "antes_despues" : "foto";

  const imagen = await leerImagen(formData.get("imagen"));
  if (typeof imagen === "string") return { error: imagen, valores };

  let imagen_antes: Buffer | null = null;
  if (tipo === "antes_despues") {
    const antes = await leerImagen(formData.get("imagen_antes"));
    if (typeof antes === "string") return { error: `Foto de «antes»: ${antes.toLowerCase()}`, valores };
    imagen_antes = antes;
  }

  await fotos.crearFoto({ ...datos, tipo, imagen, imagen_antes });
  revalidatePath("/", "layout");
  redirect("/admin/galeria");
}

// Subida rápida (como en WordPress): se llama una vez por cada foto elegida, sin título.
// La categoría es opcional y la misma para todas las fotos de esa tanda.
export async function subirFotoRapida(formData: FormData): Promise<{ error?: string }> {
  await requireSession();
  const datos = leerDatos(formData);
  if (typeof datos === "string") return { error: datos };
  const imagen = await leerImagen(formData.get("imagen"));
  if (typeof imagen === "string") return { error: imagen };

  await fotos.crearFoto({ ...datos, tipo: "foto", imagen, imagen_antes: null, visible: formData.get("visible") === "si" });
  revalidatePath("/", "layout");
  return {};
}

export async function editarFoto(id: number, _prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const valores = valoresDe(formData);

  const datos = leerDatos(formData);
  if (typeof datos === "string") return { error: datos, valores };

  const imagen = await leerImagenOpcional(formData.get("imagen"));
  if (typeof imagen === "string") return { error: imagen, valores };
  const imagen_antes = await leerImagenOpcional(formData.get("imagen_antes"));
  if (typeof imagen_antes === "string") return { error: `Foto de «antes»: ${imagen_antes.toLowerCase()}`, valores };

  await fotos.actualizarFoto(comprobarId(id), { ...datos, imagen, imagen_antes });
  revalidatePath("/", "layout");
  redirect("/admin/galeria");
}

export async function alternarVisibleFoto(id: number, visible: boolean) {
  await requireSession();
  await fotos.cambiarVisibleFoto(comprobarId(id), visible === true);
  revalidatePath("/", "layout");
}

export async function borrarFoto(id: number) {
  await requireSession();
  await fotos.borrarFoto(comprobarId(id));
  revalidatePath("/", "layout");
}
