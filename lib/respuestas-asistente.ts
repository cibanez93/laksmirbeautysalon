// Respuestas preparadas de la asistente (gratis, sin IA).
// Cómo funciona:
//   1. Cada TEMA tiene una lista de palabras clave y una respuesta.
//   2. Se cuenta cuántas palabras de cada tema aparecen en la pregunta y gana el que más tiene.
//   3. Si la pregunta es de seguimiento ("¿y cuánto dura?"), se usa el tema del mensaje anterior.
// Si algún día se activa la IA (lib/asistente/preguntar.ts), estas respuestas quedan como plan B.
// Regla: nunca se dan precios (decisión del salón).
import { salon } from "./salon";

export interface Enlace {
  texto: string;
  href: string;
}

export interface Respuesta {
  texto: string;
  enlaces?: Enlace[];
}

// ------------------------------------------------------------------ Botones

const reservar: Enlace = { texto: "Reservar cita", href: salon.booksy };
const whatsapp: Enlace = { texto: "WhatsApp", href: `https://wa.me/${salon.whatsapp}` };
const llamar: Enlace = { texto: "Llamar", href: salon.telefonoEnlace };
const pagina = (texto: string, slug: string): Enlace => ({ texto, href: `/servicios/${slug}` });

// ------------------------------------------------------------------ Texto

// Quita tildes pero conserva la ñ ("Uñas" -> "uñas", "Depilación" -> "depilacion")
const normalizar = (t: string) => t.toLowerCase().normalize("NFD").replace(/(?!̃)[̀-ͯ]/g, "").normalize("NFC");

// Cuenta cuántas palabras clave aparecen. Se buscan palabras que EMPIECEN así ("pie" no encuentra "piel")
const coincidencias = (t: string, palabras: string[]) => palabras.filter((p) => new RegExp(`(^|[^a-zñ])${p}`).test(t)).length;

// ------------------------------------------------------------------ Temas
// Los temas más concretos van antes: si empatan, gana el primero de la lista.

interface Tema {
  id: string;
  palabras: string[];
  respuesta: Respuesta;
}

const temas: Tema[] = [
  // --- Salud primero: si lo mencionan, es lo más importante
  {
    id: "embarazo",
    palabras: ["embaraz", "lactancia", "alergi", "medicacion", "enfermedad", "quimioterapia"],
    respuesta: {
      texto: "En esos casos es mejor que nos lo cuentes antes de reservar, porque algunos tratamientos no son recomendables. Escríbenos o llámanos y te asesoramos, y ante cualquier duda de salud consulta también con tu médico.",
      enlaces: [whatsapp, llamar],
    },
  },

  // --- Peluquería
  {
    id: "mechas",
    palabras: ["mecha", "balayage", "babylight", "rubi", "aclarar", "iluminar", "reflejo"],
    respuesta: {
      texto: "¡Las mechas son lo nuestro! ✨ Hacemos mechas clásicas y mechas especiales como balayage o babylights, diseñadas a medida para un resultado natural. Si tienes un color complicado, te recomendamos una valoración previa en el salón.",
      enlaces: [pagina("Ver peluquería", "peluqueria"), reservar],
    },
  },
  {
    id: "color",
    palabras: ["color", "tinte", "teñir", "tenir", "cana", "raiz", "raices", "barro", "sin quimic"],
    respuesta: {
      texto: "Para el color tenemos tinte de raíz y color completo, y también coloración con barros: una opción 100 % natural que cubre sin dañar el cabello y cuida el cuero cabelludo. Ideal si buscas algo más respetuoso.",
      enlaces: [pagina("Ver peluquería", "peluqueria"), reservar],
    },
  },
  {
    id: "alisado",
    palabras: ["alisado", "alisar", "liso", "tanino", "keratina", "encrespa", "frizz", "rebelde"],
    respuesta: {
      texto: "Nuestro alisado es con taninos: un tratamiento orgánico que alisa el cabello y lo hidrata en profundidad. Deja el cabello liso, brillante y fácil de peinar.",
      enlaces: [pagina("Ver peluquería", "peluqueria"), reservar],
    },
  },
  {
    id: "rizos",
    palabras: ["rizo", "rizado", "ondulado", "curly"],
    respuesta: {
      texto: "¡Nos encantan los rizos! 🌀 Trabajamos el método curly: limpieza de iniciación, hidratación y definición para que tus rizos luzcan sanos y definidos.",
      enlaces: [pagina("Ver peluquería", "peluqueria"), reservar],
    },
  },
  {
    id: "cabello-danado",
    palabras: ["dañad", "danad", "seco", "quemad", "estropead", "puntas", "caida", "se me cae", "debil", "caspa", "descama", "picor", "tratamiento capilar"],
    respuesta: {
      texto: "Lo primero es ver cómo está tu cabello: en el salón lo analizamos y te recomendamos el tratamiento capilar que necesita (nutrición, reparación, o un peeling capilar si hay descamación). Muchas veces un buen corte de puntas y un tratamiento hacen maravillas 💆‍♀️",
      enlaces: [pagina("Ver peluquería", "peluqueria"), reservar],
    },
  },
  {
    id: "corte",
    palabras: ["corte", "cortar", "cortarme", "flequillo", "melena", "pelo corto", "cambio de look", "favorece", "caballero", "hombre", "chico", "niño", "nino", "niña", "infantil"],
    respuesta: {
      texto: "Hacemos cortes para mujer, hombre y niños. Antes de cortar miramos tu tipo de cabello, la forma de tu cara y tu estilo para encontrar el corte que te favorece y que sea fácil de llevar en el día a día 💇‍♀️",
      enlaces: [pagina("Ver peluquería", "peluqueria"), reservar],
    },
  },
  {
    id: "peinado",
    palabras: ["peinado", "peinar", "recogido", "semirrecogido", "moño", "trenza", "evento", "fiesta", "comunion", "graduacion"],
    respuesta: {
      texto: "Para un evento te hacemos peinado o recogido a medida, y si quieres también el maquillaje. Si es para una boda (novia o invitada), echa un vistazo a nuestros packs 💛",
      enlaces: [pagina("Ver peluquería", "peluqueria"), { texto: "Novias e invitadas", href: "/novias" }, reservar],
    },
  },

  // --- Novias
  {
    id: "novias",
    palabras: ["boda", "novia", "casar", "me caso", "madrina", "invitada", "dama de honor", "prueba de peinado", "prueba de maquillaje"],
    respuesta: {
      texto: "¡Enhorabuena! 💛 Tenemos tres packs de novia (Esencial, Completo y Premium) con prueba, peinado, maquillaje y cuidados previos como limpieza facial o manicura. También peinamos y maquillamos a madrinas e invitadas. Elige tu pack y pídenos información por WhatsApp.",
      enlaces: [{ texto: "Ver packs de novia", href: "/novias" }, whatsapp],
    },
  },

  // --- Piel
  {
    id: "acne",
    palabras: ["acne", "grano", "espinilla", "punto negro", "poro", "piel grasa", "brillo", "impureza"],
    respuesta: {
      texto: "Para pieles grasas o con granitos lo ideal es empezar con nuestro diagnóstico facial gratuito (15 min) y después una limpieza facial profunda o el tratamiento para pieles grasas. Si el acné es fuerte, te recomendamos consultarlo también con tu dermatólogo.",
      enlaces: [pagina("Tratamientos faciales", "tratamientos-faciales"), reservar],
    },
  },
  {
    id: "manchas",
    palabras: ["mancha", "pigment", "melasma", "apagad", "luminosidad", "vitamina c"],
    respuesta: {
      texto: "Para manchas y piel apagada tenemos el tratamiento despigmentante y el iluminador con vitamina C. Empezamos con un diagnóstico facial gratuito para ver tu piel y elegir el tratamiento adecuado ✨",
      enlaces: [pagina("Tratamientos faciales", "tratamientos-faciales"), reservar],
    },
  },
  {
    id: "antiedad",
    palabras: ["arruga", "antiedad", "anti edad", "envejec", "flacidez", "firmeza", "rejuvenec", "dermapen", "peeling", "ojera", "bolsas"],
    respuesta: {
      texto: "Para arrugas y flacidez tenemos tratamientos antiedad como el Q10, la radiofrecuencia facial, el dermapen o el peeling químico, y un tratamiento específico para el contorno de ojos. Con el diagnóstico facial gratuito te decimos cuál te conviene más.",
      enlaces: [pagina("Tratamientos faciales", "tratamientos-faciales"), reservar],
    },
  },
  {
    id: "piel-sensible",
    palabras: ["sensible", "rojez", "irritad", "reactiva", "atopica", "tirante", "piel seca", "deshidratad"],
    respuesta: {
      texto: "Tenemos un tratamiento específico para pieles sensibles e irritadas, con activos que refuerzan la barrera natural de la piel. Si notas tirantez o sequedad, también te podemos recomendar un tratamiento hidratante personalizado.",
      enlaces: [pagina("Tratamientos faciales", "tratamientos-faciales"), reservar],
    },
  },
  {
    id: "piel",
    palabras: ["piel", "facial", "cara", "cutis", "limpieza", "diagnostico", "mascarilla"],
    respuesta: {
      texto: "Para la piel te recomiendo empezar por nuestro diagnóstico facial: es gratis, dura unos 15 minutos y analiza tu piel con tecnología de imagen. Con el resultado te decimos qué tratamiento necesitas. ¿Qué es lo que más te preocupa de tu piel?",
      enlaces: [pagina("Tratamientos faciales", "tratamientos-faciales"), reservar],
    },
  },

  // --- Cuerpo
  {
    id: "corporal",
    palabras: ["celulitis", "retencion", "liquidos", "piernas cansadas", "piernas pesadas", "presoterapia", "maderoterapia", "radiofrecuencia", "reafirmar", "tripa", "abdomen", "grasa localizada", "moldear"],
    respuesta: {
      texto: "Para celulitis, retención de líquidos o flacidez tenemos presoterapia, maderoterapia y radiofrecuencia corporal, que se pueden combinar para potenciar los resultados. La presoterapia además deja las piernas muy ligeras desde la primera sesión.",
      enlaces: [pagina("Tratamientos corporales", "tratamientos-corporales"), reservar],
    },
  },
  {
    id: "masajes",
    palabras: ["masaje", "relax", "relaj", "estres", "desconectar", "contractura", "espalda"],
    respuesta: {
      texto: "Tenemos masaje relajante, anticelulítico y masaje de pies. Un ratito para desconectar y cuidarte 🌿",
      enlaces: [pagina("Ver masajes", "masajes"), reservar],
    },
  },

  // --- Uñas y pies
  {
    id: "una-rota",
    palabras: ["rota", "roto", "partid", "reparar", "reparacion", "levantad", "despegad"],
    respuesta: {
      texto: "¡No te preocupes! Reserva el servicio de reparación de uña. Si han pasado como máximo 7 días desde que te hiciste las uñas con nosotras, la reparación es gratuita 💅",
      enlaces: [reservar, whatsapp],
    },
  },
  {
    id: "unas",
    palabras: ["uña", "manicura", "semipermanente", "esmalt", "esculpid", "gel", "acrilico", "acrigel", "rusa", "cuticula", "manos"],
    respuesta: {
      texto: "Depende de lo que busques 💅 Si quieres color que dure semanas, te va la manicura semipermanente. Si se te rompen o las quieres más largas, las uñas esculpidas. Y si solo quieres cuidarlas, la manicura rusa deja la cutícula perfecta. ¿Cómo tienes ahora tus uñas?",
      enlaces: [pagina("Ver manicura", "manicura"), reservar],
    },
  },
  {
    id: "pies",
    palabras: ["pie$", "pie[^l]", "pies", "pedicura", "dureza", "talon", "callo"],
    respuesta: {
      texto: "Para tus pies tenemos pedicura básica, pedicura completa con eliminación de durezas, con esmaltado semipermanente y nuestro ritual Laksmir, que es un momento de cuidado total 🦶✨",
      enlaces: [pagina("Ver pedicura", "pedicura"), reservar],
    },
  },

  // --- Mirada, depilación y maquillaje
  {
    id: "mirada",
    palabras: ["ceja", "pestaña", "lifting", "laminado", "laminacion", "henna", "hilo", "mirada"],
    respuesta: {
      texto: "Para la mirada tenemos laminado de cejas, lifting y tinte de pestañas, henna y depilación con hilo. El lifting de pestañas es perfecto si quieres pestañas más largas y rizadas sin extensiones ✨",
      enlaces: [pagina("Diseño de mirada", "diseno-de-mirada"), reservar],
    },
  },
  {
    id: "depilacion",
    palabras: ["depila", "cera", "vello", "piernas", "axila", "ingles", "bigote"],
    respuesta: {
      texto: "Hacemos depilación con cera y depilación con hilo para el diseño de cejas. Reserva y te lo dejamos todo perfecto.",
      enlaces: [pagina("Ver depilación", "depilacion"), reservar],
    },
  },
  {
    id: "maquillaje",
    palabras: ["maquilla", "make up", "makeup"],
    respuesta: {
      texto: "Hacemos maquillaje profesional para novias y para cualquier evento, con un acabado que dura todo el día y resalta tu belleza natural 💄",
      enlaces: [pagina("Ver maquillaje", "maquillaje"), reservar],
    },
  },

  // --- Información práctica
  {
    id: "regalo",
    palabras: ["regal", "tarjeta regalo", "cheque", "bono", "cumpleaños", "sorpresa"],
    respuesta: {
      texto: "¡Qué buena idea! 🎁 Tenemos tarjetas regalo para cualquier servicio. Puedes comprarlas en Booksy en un minuto.",
      enlaces: [{ texto: "Comprar en Booksy", href: salon.booksy }],
    },
  },
  {
    id: "precio",
    palabras: ["precio", "cuanto cuesta", "cuanto vale", "cuanto sale", "cuanto es", "tarifa", "euros", "caro", "barato", "presupuesto", "oferta", "descuento"],
    respuesta: {
      texto: "Los precios los puedes consultar en Booksy al elegir cada servicio. Si me cuentas qué buscas, te ayudo a encontrar el tratamiento que mejor te va 😊",
      enlaces: [{ texto: "Ver en Booksy", href: salon.booksy }],
    },
  },
  {
    id: "duracion",
    palabras: ["cuanto dura", "cuanto tarda", "cuanto tiempo", "duracion", "tardais"],
    respuesta: {
      texto: "La duración de cada servicio la tienes en nuestra página de servicios y también en Booksy al reservar. ¿De qué servicio quieres saberlo?",
      enlaces: [{ texto: "Ver servicios", href: "/servicios" }],
    },
  },
  {
    id: "cancelar",
    palabras: ["cancelar", "anular", "cambiar la cita", "cambiar mi cita", "mover la cita", "no puedo ir", "retrasar"],
    respuesta: {
      texto: "Puedes cambiar o cancelar tu cita desde Booksy, en el apartado de tus reservas. Si tienes cualquier problema, llámanos o escríbenos por WhatsApp.",
      enlaces: [{ texto: "Ir a Booksy", href: salon.booksy }, whatsapp],
    },
  },
  {
    id: "urgente",
    palabras: ["hoy", "ahora mismo", "urgente", "esta tarde", "esta mañana", "hueco", "disponib", "sitio libre"],
    respuesta: {
      texto: "En Booksy ves los huecos libres al momento. Si lo necesitas para hoy y no encuentras hueco, llámanos y miramos si podemos hacerte un sitio 📞",
      enlaces: [reservar, llamar],
    },
  },
  {
    id: "reservar",
    palabras: ["cita", "reserv", "pedir hora", "coger hora", "apuntarme", "turno"],
    respuesta: {
      texto: "¡Genial! Puedes reservar online en Booksy a cualquier hora, eligiendo el servicio y la profesional. Si lo prefieres, también puedes llamarnos o escribirnos por WhatsApp.",
      enlaces: [reservar, whatsapp],
    },
  },
  {
    id: "horario",
    palabras: ["horario", "abierto", "abris", "cerrado", "cerrais", "a que hora", "sabado", "domingo", "lunes", "festivo"],
    respuesta: {
      texto: `Nuestro horario es: ${salon.horario.map((h) => `${h.dias.toLowerCase()}, ${h.horas.toLowerCase()}`).join("; ")}.`,
      enlaces: [reservar],
    },
  },
  {
    id: "donde",
    palabras: ["donde", "direccion", "llegar", "ubicacion", "aparcar", "parking", "mapa", "estais", "calle"],
    respuesta: {
      texto: `Estamos en ${salon.direccion.calle}, en el barrio de ${salon.direccion.localidad} (Pamplona). En la página de contacto tienes el mapa y el botón para ir con Google Maps.`,
      enlaces: [{ texto: "Cómo llegar", href: salon.mapas.comoLlegar }, { texto: "Contacto", href: "/contacto" }],
    },
  },
  {
    id: "contacto",
    palabras: ["telefono", "llamar", "whatsapp", "contactar", "hablar con alguien", "email", "correo", "instagram"],
    respuesta: {
      texto: `Puedes llamarnos o escribirnos por WhatsApp al ${salon.telefono}, y seguirnos en Instagram (${salon.instagram.usuario}). ¡Te atendemos encantadas!`,
      enlaces: [llamar, whatsapp],
    },
  },
  {
    id: "equipo",
    palabras: ["carla", "helen", "erika", "equipo", "quien", "quienes", "dueña", "duena"],
    respuesta: {
      texto: "Somos tres: Carla, fundadora del salón, estilista y esteticista; Helen, esteticista especializada en tratamientos faciales, corporales y uñas; y Erika, estilista, que además hace manicura y pedicura. En Booksy puedes elegir con quién reservar 💛",
      enlaces: [{ texto: "Conócenos", href: "/nosotras" }, reservar],
    },
  },
  {
    id: "marcas",
    palabras: ["marca", "producto", "wella", "casmara", "kinetics", "que usais", "que utilizais"],
    respuesta: {
      texto: "Trabajamos con marcas profesionales: Wella Professionals y SP System Professional en peluquería, Casmara en estética facial, Kinetics en uñas y Tanino Therapy para el alisado.",
      enlaces: [{ texto: "Conócenos", href: "/nosotras" }],
    },
  },
];

// Respuestas generales que solo se usan si no hay nada más concreto
const saludo: Respuesta = { texto: "¡Hola! 😊 Cuéntame qué te gustaría hacerte o qué te preocupa de tu cabello, tu piel o tus uñas, y te recomiendo lo mejor para ti." };
const gracias: Respuesta = { texto: "¡A ti! Cuando quieras, puedes reservar tu cita 💛", enlaces: [reservar] };
const noSe: Respuesta = {
  texto: `Uy, eso no sé responderlo 😅. Pregúntame por peluquería, estética, uñas, novias, horarios o citas, o si lo prefieres llámanos al ${salon.telefono} o escríbenos por WhatsApp.`,
  enlaces: [whatsapp, llamar],
};

// Preguntas cortas de seguimiento: "¿y cuánto dura?", "¿y cuánto cuesta?"
const esSeguimiento = (t: string) => t.split(/\s+/).length <= 6;

function mejorTema(t: string): Tema | undefined {
  let mejor: Tema | undefined;
  let puntos = 0;
  for (const tema of temas) {
    const n = coincidencias(t, tema.palabras);
    if (n > puntos) {
      mejor = tema;
      puntos = n;
    }
  }
  return mejor;
}

// anteriores = mensajes anteriores de la clienta, del más antiguo al más reciente
export function responder(pregunta: string, anteriores: string[] = []): Respuesta {
  const t = normalizar(pregunta);
  const tema = mejorTema(t);

  // Precio o duración justo después de hablar de un servicio: responder sobre ese servicio
  if ((tema?.id === "precio" || tema?.id === "duracion") && esSeguimiento(t) && anteriores.length) {
    const servicioAnterior = mejorTema(normalizar(anteriores.at(-1)!))?.respuesta.enlaces?.find((e) => e.href.startsWith("/servicios/"));
    if (servicioAnterior) {
      const nombre = servicioAnterior.texto.replace(/^Ver /, "").toLowerCase();
      const texto = tema.id === "precio"
        ? `El precio lo ves en Booksy al elegir el servicio. Si tienes dudas sobre qué elegir de ${nombre}, te asesoramos en el salón 😊`
        : `Tienes la duración de cada servicio de ${nombre} en su página, y también en Booksy al reservar.`;
      return { texto, enlaces: [servicioAnterior, reservar] };
    }
  }

  // Precio de un servicio concreto ("¿cuánto cuesta un tinte?"): hablar del servicio y remitir a Booksy
  const temaPrecio = temas.find((x) => x.id === "precio")!;
  if (tema && tema.id !== "precio" && coincidencias(t, temaPrecio.palabras)) {
    return {
      texto: `${tema.respuesta.texto} El precio lo puedes ver en Booksy al elegir el servicio 😊`,
      enlaces: tema.respuesta.enlaces,
    };
  }

  if (tema) return tema.respuesta;
  if (coincidencias(t, ["gracias", "genial", "perfecto", "estupendo"])) return gracias;
  if (coincidencias(t, ["hola", "buenas", "buenos dias", "hey"])) return saludo;
  return noSe;
}
