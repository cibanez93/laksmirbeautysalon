"use server";
// Acciones del panel para el blog: crear, editar, publicar y borrar artículos.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as articulos from "@/lib/articulos";
import { crearSlug, temasBlog, type Tema } from "@/lib/blog";
import { equipo } from "@/lib/equipo";
import { requireSession } from "@/lib/session";
import type { EstadoFormulario } from "../actions";
import { comprobarId, valoresDe } from "../utilidades";

function leerFormulario(formData: FormData): articulos.DatosArticulo | string {
  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();
  const titulo = texto("titulo");
  const resumen = texto("resumen");
  const contenido = texto("contenido");
  const tema = texto("tema");
  const autora = texto("autora");
  const fecha = texto("fecha");

  if (!titulo) return "El título es obligatorio.";
  if (titulo.length > 200) return "El título no puede tener más de 200 caracteres.";
  if (!resumen) return "El resumen es obligatorio (es lo que se ve en la lista y en Google).";
  if (resumen.length > 300) return "El resumen no puede tener más de 300 caracteres.";
  if (!contenido) return "El artículo no tiene texto.";
  if (!temasBlog.some((t) => t.slug === tema)) return "Elige un tema.";
  if (!equipo.some((p) => p.nombre === autora)) return "Elige quién firma el artículo.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || Number.isNaN(Date.parse(fecha))) return "La fecha no es válida.";

  return { titulo, resumen, contenido, tema: tema as Tema, autora, fecha, publicado: formData.get("publicado") === "on" };
}

export async function crearArticulo(_prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };

  // La dirección web sale del título. Si ya existe, se le añade un número: -2, -3...
  const base = crearSlug(datos.titulo) || "articulo";
  let slug = base;
  for (let n = 2; await articulos.existeSlug(slug); n++) slug = `${base}-${n}`;

  await articulos.crearArticulo(slug, datos);
  revalidatePath("/", "layout");
  redirect("/admin/blog");
}

export async function editarArticulo(id: number, _prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };

  await articulos.actualizarArticulo(comprobarId(id), datos);
  revalidatePath("/", "layout");
  redirect("/admin/blog");
}

export async function alternarPublicado(id: number, publicado: boolean) {
  await requireSession();
  await articulos.cambiarPublicado(comprobarId(id), publicado === true);
  revalidatePath("/", "layout");
}

export async function borrarArticulo(id: number) {
  await requireSession();
  await articulos.borrarArticulo(comprobarId(id));
  revalidatePath("/", "layout");
}
