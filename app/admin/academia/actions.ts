"use server";
// Acciones del panel para los cursos de Laksmir Academy
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as cursos from "@/lib/cursos";
import * as fotos from "@/lib/fotos";
import { requireSession } from "@/lib/session";
import type { EstadoFormulario } from "../actions";
import { comprobarId, leerImagenOpcional, valoresDe } from "../utilidades";

function leerFormulario(formData: FormData): cursos.DatosCurso | string {
  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();
  const nombre = texto("nombre");
  const publico = texto("publico");
  const formato = texto("formato");
  const descripcion = texto("descripcion");
  const incluye = texto("incluye");
  const duracion = texto("duracion");
  const precio = Number(texto("precio").replace(",", "."));
  const orden = Number(texto("orden") || "0");

  if (!nombre) return "El nombre es obligatorio.";
  if (nombre.length > 120) return "El nombre no puede tener más de 120 caracteres.";
  if (publico !== "clientas" && publico !== "profesionales") return "Elige para quién es el curso.";
  if (formato !== "presencial" && formato !== "online") return "Elige si es presencial u online.";
  if (!descripcion) return "La descripción es obligatoria.";
  if (!duracion) return "Escribe la duración (por ejemplo, «3 horas»).";
  if (duracion.length > 80) return "La duración no puede tener más de 80 caracteres.";
  if (!Number.isFinite(precio) || precio <= 0 || precio > 99999) return "Escribe un precio válido (por ejemplo, 45).";
  if (!Number.isInteger(orden)) return "El orden debe ser un número entero.";

  // Fecha y plazas: solo para los presenciales
  let fecha: string | null = null;
  let plazas: number | null = null;
  let plazas_libres: number | null = null;
  if (formato === "presencial") {
    fecha = texto("fecha");
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(fecha)) return "Elige el día y la hora del curso.";
    plazas = Number(texto("plazas"));
    if (!Number.isInteger(plazas) || plazas < 1 || plazas > 500) return "Escribe cuántas plazas hay en total.";
    // Si no se escribe, al principio están todas libres
    plazas_libres = texto("plazas_libres") === "" ? plazas : Number(texto("plazas_libres"));
    if (!Number.isInteger(plazas_libres) || plazas_libres < 0) return "Las plazas libres tienen que ser un número (0 = completo).";
    if (plazas_libres > plazas) return "No puede haber más plazas libres que plazas en total.";
  }

  return { nombre, publico, formato, descripcion, incluye, duracion, fecha, plazas, plazas_libres, precio, orden, activo: formData.get("activo") === "on" };
}

export async function crearCurso(_prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };
  const imagen = await leerImagenOpcional(formData.get("imagen"));
  if (typeof imagen === "string") return { error: imagen, valores: valoresDe(formData) };

  const id = await cursos.crearCurso(datos);
  if (imagen) await cursos.cambiarFotoCurso(id, await fotos.crearImagenInterna(datos.nombre, "curso", imagen));
  revalidatePath("/", "layout");
  redirect("/admin/academia");
}

export async function editarCurso(id: number, _prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };

  const curso = await cursos.obtenerCurso(comprobarId(id));
  if (!curso) return { error: "Este curso ya no existe." };

  // Foto: nueva, quitarla o dejar la que había
  const imagen = await leerImagenOpcional(formData.get("imagen"));
  if (typeof imagen === "string") return { error: imagen, valores: valoresDe(formData) };
  if (imagen || formData.get("quitar_imagen") === "on") {
    await cursos.cambiarFotoCurso(id, imagen ? await fotos.crearImagenInterna(datos.nombre, "curso", imagen) : null);
    if (curso.foto_id) await fotos.borrarImagenInterna(curso.foto_id);
  }

  await cursos.actualizarCurso(id, datos);
  revalidatePath("/", "layout");
  redirect("/admin/academia");
}

export async function alternarActivoCurso(id: number, activo: boolean) {
  await requireSession();
  await cursos.cambiarActivoCurso(comprobarId(id), activo === true);
  revalidatePath("/", "layout");
}

export async function borrarCurso(id: number) {
  await requireSession();
  const curso = await cursos.obtenerCurso(comprobarId(id));
  await cursos.borrarCurso(id);
  if (curso?.foto_id) await fotos.borrarImagenInterna(curso.foto_id);
  revalidatePath("/", "layout");
}
