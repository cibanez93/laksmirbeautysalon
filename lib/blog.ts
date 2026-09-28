// Artículos del blog.
// PROVISIONAL: artículos de EJEMPLO para diseñar la página. En la fase de funcionamiento
// se guardarán en la tabla "articulos" de MySQL y se escribirán desde el panel de admin.
//
// Formato del contenido (sencillo, sin librerías):
//   - Párrafos separados por una línea en blanco
//   - "## " al principio = subtítulo
//   - "- " al principio de cada línea = lista

export interface CategoriaBlog {
  slug: string;
  nombre: string;
  servicio: string; // página de servicios relacionada (para enlazar y ayudar al SEO)
}

export const categoriasBlog: CategoriaBlog[] = [
  { slug: "cabello", nombre: "Cabello", servicio: "peluqueria" },
  { slug: "piel", nombre: "Piel", servicio: "tratamientos-faciales" },
  { slug: "unas", nombre: "Uñas", servicio: "manicura" },
  { slug: "novias", nombre: "Novias", servicio: "maquillaje" },
];

export interface Articulo {
  slug: string;
  titulo: string;
  resumen: string;
  categoria: string;
  fecha: string; // AAAA-MM-DD
  autora: string;
  contenido: string;
  ejemplo?: boolean;
}

export const articulos: Articulo[] = [
  {
    slug: "como-cuidar-el-color-despues-de-unas-mechas",
    titulo: "Cómo cuidar el color después de unas mechas",
    resumen: "Unos gestos sencillos en casa para que tu color se mantenga luminoso durante más tiempo.",
    categoria: "cabello",
    fecha: "2026-09-20",
    autora: "Carla",
    ejemplo: true,
    contenido: `Este es un artículo de ejemplo para ver cómo quedará el blog. El texto real lo escribirá el equipo del salón.

## Los primeros días

- Espera al menos 48 horas antes del primer lavado.
- Usa un champú específico para cabellos con color.
- Evita el agua muy caliente.

## Protege tu melena del sol

El sol y el cloro apagan el color. En verano, usa productos con protección y aclara el cabello después de bañarte.`,
  },
  {
    slug: "limpieza-facial-cada-cuanto",
    titulo: "¿Cada cuánto conviene hacerse una limpieza facial?",
    resumen: "Depende de tu tipo de piel. Te explicamos cómo saber cuál es el ritmo ideal para ti.",
    categoria: "piel",
    fecha: "2026-09-10",
    autora: "Helen",
    ejemplo: true,
    contenido: `Este es un artículo de ejemplo para ver cómo quedará el blog. El texto real lo escribirá el equipo del salón.

## Cada piel es diferente

La frecuencia ideal depende de si tu piel es grasa, seca, mixta o sensible. Por eso siempre empezamos con un diagnóstico facial.

## Cuidados en casa

Una buena limpieza diaria, hidratación y protección solar hacen que los resultados de cabina duren más.`,
  },
  {
    slug: "semipermanente-o-esculpidas",
    titulo: "Semipermanente o uñas esculpidas: ¿cuál elegir?",
    resumen: "Las diferencias entre las dos técnicas para que sepas cuál encaja mejor contigo.",
    categoria: "unas",
    fecha: "2026-08-28",
    autora: "Helen",
    ejemplo: true,
    contenido: `Este es un artículo de ejemplo para ver cómo quedará el blog. El texto real lo escribirá el equipo del salón.

## Semipermanente

Color sobre tu uña natural, con un acabado brillante que dura semanas.

## Esculpidas

Alargan la uña y le dan forma, ideales si quieres más longitud o tus uñas se rompen con facilidad.`,
  },
];

export const articuloPorSlug = (slug: string) => articulos.find((a) => a.slug === slug);
export const categoriaBlog = (slug: string) => categoriasBlog.find((c) => c.slug === slug);

export function fechaBonita(fecha: string) {
  return new Date(`${fecha}T12:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

// Minutos de lectura: unas 200 palabras por minuto
export function minutosLectura(texto: string) {
  return Math.max(1, Math.round(texto.split(/\s+/).length / 200));
}
