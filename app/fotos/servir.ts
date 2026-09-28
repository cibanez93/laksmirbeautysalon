// Devuelve una imagen de la galería guardada en la base de datos
import "server-only";
import { obtenerImagen } from "@/lib/fotos";

export async function servirImagen(idTexto: string, parte: "imagen" | "imagen_antes") {
  const id = Number(idTexto);
  if (!Number.isInteger(id) || id <= 0) return new Response("No encontrada", { status: 404 });

  const datos = await obtenerImagen(id, parte);
  if (!datos) return new Response("No encontrada", { status: 404 });

  return new Response(new Uint8Array(datos), {
    headers: {
      "Content-Type": "image/jpeg",
      // La foto se puede cambiar desde el panel: el navegador la guarda solo 5 minutos
      "Cache-Control": "public, max-age=300",
    },
  });
}
