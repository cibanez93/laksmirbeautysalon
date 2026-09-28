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
