// Nota y número de opiniones de Google y Booksy, actualizados solos una vez al día.
//   - Booksy: se lee de la página pública del salón, que publica la nota en formato
//     schema.org (el mismo que usan los buscadores). Gratis y sin cuentas.
//   - Google: solo con la API de Google Places (necesita GOOGLE_PLACES_API_KEY y GOOGLE_PLACE_ID).
//     Si no están configuradas, se usan los valores guardados en lib/salon.ts.
// Si algo falla, también se usan los valores guardados: la portada nunca se queda sin notas.
import "server-only";
import { salon } from "./salon";

export interface Opinion {
  nota: string; // "4,9"
  total: number;
}

const UN_DIA = 60 * 60 * 24;

// 4.948 -> "4,9" (formato español, un decimal)
const formatearNota = (n: number) => n.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

async function opinionesBooksy(): Promise<Opinion | null> {
  try {
    const respuesta = await fetch(salon.booksy, { next: { revalidate: UN_DIA } });
    if (!respuesta.ok) return null;
    const html = await respuesta.text();
    // Busca el bloque "aggregateRating" de schema.org: {"ratingValue":4.94,"reviewCount":405}
    const bloque = html.match(/"aggregateRating"\s*:\s*\{[^}]*\}/)?.[0];
    const nota = Number(bloque?.match(/"ratingValue"\s*:\s*"?([\d.]+)/)?.[1]);
    const total = Number(bloque?.match(/"reviewCount"\s*:\s*"?(\d+)/)?.[1]);
    if (!(nota > 0 && nota <= 5) || !(total > 0)) return null;
    return { nota: formatearNota(nota), total };
  } catch {
    return null;
  }
}

async function opinionesGoogle(): Promise<Opinion | null> {
  const clave = process.env.GOOGLE_PLACES_API_KEY;
  const lugar = process.env.GOOGLE_PLACE_ID;
  if (!clave || !lugar) return null;
  try {
    const respuesta = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(lugar)}`, {
      headers: { "X-Goog-Api-Key": clave, "X-Goog-FieldMask": "rating,userRatingCount" },
      next: { revalidate: UN_DIA },
    });
    if (!respuesta.ok) return null;
    const datos = (await respuesta.json()) as { rating?: number; userRatingCount?: number };
    if (!datos.rating || !datos.userRatingCount) return null;
    return { nota: formatearNota(datos.rating), total: datos.userRatingCount };
  } catch {
    return null;
  }
}

export async function obtenerOpiniones(): Promise<{ google: Opinion; booksy: Opinion }> {
  const [google, booksy] = await Promise.all([opinionesGoogle(), opinionesBooksy()]);
  return {
    google: google ?? salon.opiniones.google,
    booksy: booksy ?? salon.opiniones.booksy,
  };
}
