// Datos y ayudas del blog que se usan tanto en la web como en el panel.
// Los artículos se guardan en la tabla "articulos" (ver lib/articulos.ts).
//
// Formato del contenido (sencillo, sin librerías):
//   - Párrafos separados por una línea en blanco
//   - "## " al principio = subtítulo
//   - "- " al principio de cada línea = lista

export type Tema = "cabello" | "piel" | "unas" | "novias";

export interface TemaBlog {
  slug: Tema;
  nombre: string;
  servicio: string; // página de servicios relacionada (para enlazar y ayudar al SEO)
}

export const temasBlog: TemaBlog[] = [
  { slug: "cabello", nombre: "Cabello", servicio: "peluqueria" },
  { slug: "piel", nombre: "Piel", servicio: "tratamientos-faciales" },
  { slug: "unas", nombre: "Uñas", servicio: "manicura" },
  { slug: "novias", nombre: "Novias", servicio: "maquillaje" },
];

export const temaBlog = (slug: string) => temasBlog.find((t) => t.slug === slug);

export function fechaBonita(fecha: string) {
  return new Date(`${fecha}T12:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

// Minutos de lectura: unas 200 palabras por minuto
export function minutosLectura(texto: string) {
  return Math.max(1, Math.round(texto.split(/\s+/).length / 200));
}

// Convierte un título en dirección web: "¿Cada cuánto?" -> "cada-cuanto"
export function crearSlug(titulo: string) {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150);
}
