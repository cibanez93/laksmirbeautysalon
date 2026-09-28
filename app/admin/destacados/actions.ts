"use server";
// Acción del panel para elegir qué foto (y qué servicio) se ve en cada sitio de la web
import { revalidatePath } from "next/cache";
import * as destacados from "@/lib/destacados";
import { requireSession } from "@/lib/session";

// Convierte el valor de un desplegable en un id (o null si se eligió "foto de ejemplo")
function idONull(valor: FormDataEntryValue | null): number | null {
  const n = Number(valor);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function guardarDestacado(ubicacion: string, formData: FormData) {
  await requireSession();
  if (!destacados.esUbicacion(ubicacion)) throw new Error("Ubicación no válida");

  await destacados.guardarDestacado(ubicacion, idONull(formData.get("foto_id")), idONull(formData.get("servicio_id")));
  revalidatePath("/", "layout");
}
