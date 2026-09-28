"use server";
// Acciones del panel para la galería: subir, ocultar/mostrar y borrar fotos.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as fotos from "@/lib/fotos";
import { requireSession } from "@/lib/session";
import type { EstadoFormulario } from "../actions";
import { comprobarId, valoresDe } from "../utilidades";

const MAX_BYTES = 1.5 * 1024 * 1024; // 1,5 MB por foto (el panel ya las reduce a ~300 KB)

// Comprueba que el archivo es una foto JPEG de tamaño razonable y la convierte en Buffer
async function leerImagen(valor: FormDataEntryValue | null): Promise<Buffer | string> {
  if (!(valor instanceof File) || valor.size === 0) return "Falta la foto.";
  if (valor.type !== "image/jpeg") return "La foto tiene que ser una imagen.";
  if (valor.size > MAX_BYTES) return "La foto es demasiado grande.";
  const datos = Buffer.from(await valor.arrayBuffer());
  // Los JPEG siempre empiezan por los bytes FF D8: así comprobamos que de verdad es una foto
  if (datos[0] !== 0xff || datos[1] !== 0xd8) return "El archivo no es una foto válida.";
  return datos;
}

// Lee y valida los campos comunes (título, categoría y forma)
function leerDatos(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) return "Escribe un título (por ejemplo, «Balayage rubio»).";
  if (titulo.length > 120) return "El título no puede tener más de 120 caracteres.";

  const formaTxt = String(formData.get("forma") ?? "cuadrada");
  const forma = (["cuadrada", "vertical", "horizontal"] as const).find((f) => f === formaTxt) ?? "cuadrada";

  const categoriaTxt = String(formData.get("categoria_id") ?? "");
  const categoria_id = categoriaTxt ? Number(categoriaTxt) : null;
  if (categoria_id !== null && (!Number.isInteger(categoria_id) || categoria_id <= 0)) return "Categoría no válida.";

  return { titulo, forma, categoria_id };
}

// Si se eligió un archivo, lo comprueba; si no, devuelve null (se queda la foto que había)
async function leerImagenOpcional(valor: FormDataEntryValue | null) {
  if (!(valor instanceof File) || valor.size === 0) return null;
  return leerImagen(valor);
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
