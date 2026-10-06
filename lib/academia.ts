// Laksmir Academy: cursos para clientas y para profesionales, presenciales u online.
// EJEMPLO: estos cursos son inventados para diseñar la página. Los reales los decide Carla
// (nombre, fecha, plazas y precio) y más adelante se gestionarán desde el panel.

export type Publico = "clientas" | "profesionales";
export type Formato = "presencial" | "online";

export interface Curso {
  slug: string;
  nombre: string;
  publico: Publico;
  formato: Formato;
  descripcion: string;
  incluye: string[];
  duracion: string;
  fecha?: string; // solo los presenciales
  plazas?: number; // solo los presenciales
  plazasLibres?: number;
  precio: number; // en euros, IVA incluido
  fotoId?: number | null;
  ejemplo?: boolean; // los de ejemplo llevan la etiqueta «Ejemplo»
}

export const publicos: Record<Publico, string> = {
  clientas: "Para ti",
  profesionales: "Profesionales",
};

export const formatos: Record<Formato, string> = {
  presencial: "Presencial",
  online: "Online",
};

// Las dos opciones de la pregunta «¿Para quién es el curso?»
export const caminos: { publico: Publico; titulo: string; texto: string; puntos: string[] }[] = [
  {
    publico: "clientas",
    titulo: "Para ti",
    texto: "Aprende a cuidarte en casa como lo hacemos en el salón: maquillaje, peinados y rutinas para tu cabello y tu piel.",
    puntos: ["Sin experiencia previa", "Grupos pequeños y ambiente cercano", "Te llevas tus pasos por escrito"],
  },
  {
    publico: "profesionales",
    titulo: "Para profesionales",
    texto: "Formación práctica con las técnicas que usamos cada día en Laksmir, para que las apliques en tu cabina o tu salón.",
    puntos: ["Práctica con modelo real", "Máximo 4 alumnas por curso", "Productos profesionales"],
  },
];

// Se ven en la web solo mientras Carla no haya creado cursos en el panel
export const cursosEjemplo: Curso[] = ([
  {
    slug: "automaquillaje",
    nombre: "Automaquillaje para el día a día",
    publico: "clientas",
    formato: "presencial",
    descripcion: "Aprende a sacar partido a tus rasgos con un maquillaje natural que puedas repetir cada mañana en diez minutos.",
    incluye: ["Estudio de tu rostro y tu tono de piel", "Práctica con tu propio neceser", "Ficha con tus pasos y productos"],
    duracion: "3 horas",
    fecha: "Sábado 14 de noviembre · 10:00",
    plazas: 8,
    plazasLibres: 5,
    precio: 45,
  },
  {
    slug: "peinados-eventos",
    nombre: "Peinados fáciles para eventos",
    publico: "clientas",
    formato: "presencial",
    descripcion: "Ondas, semirrecogidos y recogidos sencillos para bodas, comuniones y celebraciones, hechos por ti misma.",
    incluye: ["Tres peinados paso a paso", "Uso de herramientas de calor sin dañar el cabello", "Trucos para que el peinado dure"],
    duracion: "2 horas y media",
    fecha: "Sábado 28 de noviembre · 10:00",
    plazas: 6,
    plazasLibres: 2,
    precio: 40,
  },
  {
    slug: "cabello-en-casa",
    nombre: "Cuida tu cabello en casa",
    publico: "clientas",
    formato: "online",
    descripcion: "Rutinas, productos y errores frecuentes: todo lo que necesitas para mantener tu cabello sano entre visita y visita.",
    incluye: ["Vídeos cortos para ver a tu ritmo", "Cómo elegir champú y mascarilla", "Acceso durante un año"],
    duracion: "1 hora y 20 minutos de vídeo",
    precio: 19,
  },
  {
    slug: "balayage-mano-alzada",
    nombre: "Balayage a mano alzada",
    publico: "profesionales",
    formato: "presencial",
    descripcion: "Técnica, colocación de la luz y matización para conseguir degradados naturales. Formación práctica con modelo.",
    incluye: ["Teoría de colorimetría aplicada", "Práctica con modelo real", "Grupo reducido de 4 alumnas"],
    duracion: "6 horas",
    fecha: "Lunes 23 de noviembre · 13:00",
    plazas: 4,
    plazasLibres: 4,
    precio: 180,
  },
  {
    slug: "semipermanente-refuerzo",
    nombre: "Manicura semipermanente con refuerzo",
    publico: "profesionales",
    formato: "presencial",
    descripcion: "Preparación de la uña, nivelación y sellado para una manicura que dure semanas sin levantarse.",
    incluye: ["Preparación y limado correctos", "Nivelación con refuerzo", "Práctica sobre modelo"],
    duracion: "5 horas",
    fecha: "Lunes 30 de noviembre · 13:00",
    plazas: 4,
    plazasLibres: 3,
    precio: 150,
  },
  {
    slug: "diagnostico-facial",
    nombre: "Diagnóstico facial y protocolo de cabina",
    publico: "profesionales",
    formato: "online",
    descripcion: "Cómo analizar la piel, escuchar a la clienta y diseñar un tratamiento personalizado que dé resultados.",
    incluye: ["Fichas de diagnóstico descargables", "Casos reales explicados", "Acceso durante un año"],
    duracion: "2 horas de vídeo",
    precio: 69,
  },
] satisfies Curso[]).map((c) => ({ ...c, ejemplo: true }));

export const preguntasAcademia = [
  {
    pregunta: "¿Necesito experiencia previa?",
    respuesta: "Para los cursos «Para ti», no: están pensados para empezar desde cero. Los cursos para profesionales piden conocimientos básicos del oficio.",
  },
  {
    pregunta: "¿Dónde se hacen los cursos presenciales?",
    respuesta: "En nuestro salón de Ripagaina (Pamplona), en grupos reducidos para que podamos atenderte bien.",
  },
  {
    pregunta: "¿Cómo veo un curso online?",
    respuesta: "Después de comprarlo podrás ver los vídeos desde el móvil o el ordenador, cuando quieras y tantas veces como necesites.",
  },
  {
    pregunta: "¿Qué pasa si no puedo ir el día del curso?",
    respuesta: "Escríbenos lo antes posible y buscamos una solución. Las condiciones de cambio y devolución las verás antes de pagar.",
  },
];
