// Categorías de servicios.
// PROVISIONAL: de momento la categoría se deduce de la columna "orden" (100 = Peluquería,
// 200 = Faciales...). Cuando creemos la tabla "categorias" en MySQL, esto se leerá de ahí.
// El orden de esta lista es el orden en que salen en la web.
//
// BORRADOR: los textos de presentación y las respuestas de las preguntas frecuentes
// tiene que revisarlos Carla antes de publicar la web.

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export interface Categoria {
  slug: string;
  nombre: string;
  intro: string;
  presentacion: string;
  preguntas: Pregunta[];
  centena: number;
}

const reservar: Pregunta = {
  pregunta: "¿Cómo puedo pedir cita?",
  respuesta: "Puedes reservar online en Booksy a cualquier hora, llamarnos al 948 04 21 90 o pasarte por el salón en Calle la Valeta 1, Ripagaina.",
};

export const categorias: Categoria[] = [
  {
    centena: 1,
    slug: "peluqueria",
    nombre: "Peluquería",
    intro: "Cortes, color, mechas y tratamientos capilares pensados para ti.",
    presentacion: "En nuestra peluquería de Ripagaina, en Pamplona, cuidamos tu melena de principio a fin: cortes para mujer, hombre y niños, color, mechas, balayage, alisados y tratamientos capilares. Antes de empezar te escuchamos y analizamos tu cabello para recomendarte lo que de verdad le sienta bien.",
    preguntas: [
      { pregunta: "¿Hacéis cortes para hombre y para niños?", respuesta: "Sí. Tenemos corte de caballero y corte infantil, además de todos los servicios de corte y peinado para mujer." },
      { pregunta: "¿Qué diferencia hay entre unas mechas normales y unas mechas especiales?", respuesta: "Las mechas especiales (babylights, balayage…) se diseñan a medida para un resultado más natural y personalizado. Si no sabes cuál elegir, te asesoramos en el salón." },
      { pregunta: "¿Tenéis alternativas más naturales para el color?", respuesta: "Sí. Trabajamos la coloración con barros, una opción 100 % natural que aporta color sin dañar la fibra capilar." },
      reservar,
    ],
  },
  {
    centena: 2,
    slug: "tratamientos-faciales",
    nombre: "Tratamientos faciales",
    intro: "Diagnóstico de la piel, limpiezas y tratamientos con aparatología profesional.",
    presentacion: "Cada piel es diferente. Por eso empezamos con un diagnóstico facial con tecnología de análisis de imagen y, a partir de ahí, elegimos el tratamiento que necesitas: limpiezas profundas, tratamientos antiedad, despigmentantes, para pieles grasas o sensibles, radiofrecuencia, dermapen o peeling químico.",
    preguntas: [
      { pregunta: "¿Cómo sé qué tratamiento facial necesito?", respuesta: "Empieza por nuestro diagnóstico facial: es gratuito, dura unos 15 minutos y analiza tu piel con tecnología de imagen. Con el resultado te recomendamos el tratamiento más adecuado." },
      { pregunta: "¿Cada cuánto conviene hacerse una limpieza facial?", respuesta: "Depende de tu tipo de piel. En el diagnóstico te indicamos la frecuencia recomendada para ti." },
      { pregunta: "¿Los tratamientos son aptos para pieles sensibles?", respuesta: "Sí, tenemos tratamientos específicos para pieles irritadas y sensibles, y adaptamos cada protocolo a tu piel." },
      reservar,
    ],
  },
  {
    centena: 3,
    slug: "tratamientos-corporales",
    nombre: "Tratamientos corporales",
    intro: "Presoterapia, radiofrecuencia y maderoterapia para sentirte bien en tu piel.",
    presentacion: "Tratamientos corporales para combatir la retención de líquidos, la celulitis y la flacidez: presoterapia médica, radiofrecuencia corporal y maderoterapia, solos o combinados para potenciar los resultados.",
    preguntas: [
      { pregunta: "¿Para qué sirve la presoterapia?", respuesta: "Ayuda a tratar la retención de líquidos y la celulitis, mejora la circulación y aporta sensación de piernas ligeras desde la primera sesión." },
      { pregunta: "¿Se pueden combinar varios tratamientos?", respuesta: "Sí. Por ejemplo, maderoterapia o radiofrecuencia con presoterapia, para potenciar los resultados." },
      reservar,
    ],
  },
  {
    centena: 4,
    slug: "manicura",
    nombre: "Manicura",
    intro: "Manos cuidadas al detalle, del esmaltado semipermanente al esculpido de uñas.",
    presentacion: "Manicura básica, rusa, semipermanente con refuerzo y esculpido de uñas en gel, acrigel o acrílico. Cuidamos la cutícula y la salud de tus uñas para que el resultado sea bonito y dure.",
    preguntas: [
      { pregunta: "¿Qué es la manicura rusa?", respuesta: "Es una limpieza profunda de la cutícula con torno que deja la uña muy limpia y hace que el esmaltado dure más." },
      { pregunta: "Se me ha roto una uña, ¿qué hago?", respuesta: "Reserva el servicio de reparación de uña. Si han pasado como máximo 7 días desde tu servicio, la reparación es gratuita." },
      reservar,
    ],
  },
  {
    centena: 8,
    slug: "pedicura",
    nombre: "Pedicura",
    intro: "Pies cuidados y bonitos, de la pedicura básica al ritual Laksmir.",
    presentacion: "Desde una pedicura básica hasta una pedicura completa con eliminación de durezas y esmaltado semipermanente, o nuestro ritual Laksmir para regalarte un momento de cuidado total.",
    preguntas: [
      { pregunta: "¿Qué pedicura elijo?", respuesta: "Si solo quieres cortar y limar, la básica. Si tienes durezas, la pedicura completa. Y si quieres un momento de relax, el ritual Laksmir." },
      reservar,
    ],
  },
  {
    centena: 9,
    slug: "depilacion",
    nombre: "Depilación",
    intro: "Depilación con cera para una piel suave.",
    presentacion: "Depilación con cera cuidando tu piel, y depilación con hilo para un diseño de cejas preciso.",
    preguntas: [reservar],
  },
  {
    centena: 5,
    slug: "maquillaje",
    nombre: "Maquillaje",
    intro: "Maquillaje profesional para novias y cualquier evento especial.",
    presentacion: "Maquillaje profesional para novias, invitadas y cualquier evento: un acabado que dura todo el día y resalta tu belleza natural.",
    preguntas: [
      { pregunta: "¿Hacéis prueba de maquillaje para novias?", respuesta: "Pregúntanos al reservar y te explicamos cómo organizamos la prueba y el día de la boda." },
      reservar,
    ],
  },
  {
    centena: 6,
    slug: "masajes",
    nombre: "Masajes",
    intro: "Un rato para desconectar y cuidar tu cuerpo.",
    presentacion: "Masajes relajantes, anticelulíticos y de pies para desconectar del día a día y cuidar tu cuerpo.",
    preguntas: [reservar],
  },
  {
    centena: 7,
    slug: "diseno-de-mirada",
    nombre: "Diseño de mirada",
    intro: "Cejas y pestañas que enmarcan tu mirada de forma natural.",
    presentacion: "Laminado de cejas, lifting y tinte de pestañas, henna y depilación con hilo para una mirada definida y natural, sin necesidad de maquillaje.",
    preguntas: [
      { pregunta: "¿Cuánto dura el lifting de pestañas?", respuesta: "El efecto se mantiene varias semanas, según el ciclo de crecimiento de tus pestañas." },
      reservar,
    ],
  },
];

export const categoriaPorSlug = (slug: string) => categorias.find((c) => c.slug === slug);

export function categoriaDeOrden(orden: number): Categoria | undefined {
  return categorias.find((c) => c.centena === Math.floor(orden / 100));
}

// Los nombres de Booksy vienen casi siempre en MAYÚSCULAS. Para la web los pasamos a formato frase:
// "MECHAS + PEINAR (cabello corto)" -> "Mechas + peinar (cabello corto)".
// Solo se mira lo que está fuera de los paréntesis: si ahí hay minúsculas, se deja igual.
export function nombreBonito(nombre: string): string {
  const fuera = nombre.replace(/\([^)]*\)/g, "");
  if (fuera !== fuera.toLocaleUpperCase("es")) return nombre;
  const minus = nombre.toLocaleLowerCase("es");
  return minus.charAt(0).toLocaleUpperCase("es") + minus.slice(1);
}

// Duración legible: 45 -> "45 min", 90 -> "1 h 30 min"
export function duracionBonita(min: number | null): string | null {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}
