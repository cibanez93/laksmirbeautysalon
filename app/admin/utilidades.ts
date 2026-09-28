// Pequeñas ayudas compartidas por las acciones del panel
import "server-only";

// Los argumentos llegan del navegador y se pueden manipular: comprobamos que el id es válido
export function comprobarId(id: unknown): number {
  if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) throw new Error("Id no válido");
  return id;
}

// Devuelve lo que se escribió en el formulario, para no vaciarlo si hay un error
export const valoresDe = (formData: FormData) =>
  Object.fromEntries([...formData].filter(([k, v]) => !k.startsWith("$") && typeof v === "string")) as Record<string, string>;

const MAX_BYTES = 1.5 * 1024 * 1024; // 1,5 MB por foto (el panel ya las reduce a ~300 KB)

// Comprueba que el archivo es una foto JPEG de tamaño razonable y la convierte en Buffer.
// Devuelve un texto con el error si algo está mal.
export async function leerImagen(valor: FormDataEntryValue | null): Promise<Buffer | string> {
  if (!(valor instanceof File) || valor.size === 0) return "Falta la foto.";
  if (valor.type !== "image/jpeg") return "La foto tiene que ser una imagen.";
  if (valor.size > MAX_BYTES) return "La foto es demasiado grande.";
  const datos = Buffer.from(await valor.arrayBuffer());
  // Los JPEG siempre empiezan por los bytes FF D8: así comprobamos que de verdad es una foto
  if (datos[0] !== 0xff || datos[1] !== 0xd8) return "El archivo no es una foto válida.";
  return datos;
}

// Igual, pero si no se eligió ninguna foto devuelve null (se queda la que había)
export async function leerImagenOpcional(valor: FormDataEntryValue | null): Promise<Buffer | string | null> {
  if (!(valor instanceof File) || valor.size === 0) return null;
  return leerImagen(valor);
}
