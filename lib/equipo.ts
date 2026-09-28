// Equipo del salón. "categorias" indica qué servicios hace cada una (slugs de lib/categorias.ts).
// PENDIENTE DE CONFIRMAR: quién hace maquillaje, masajes, depilación y diseño de mirada.
// BORRADOR: las historias las tiene que leer y corregir cada una antes de publicar la web.
// No incluyen años, títulos ni premios porque no los sabemos: si los hay, se añaden.

export interface Profesional {
  nombre: string;
  cargo: string;
  especialidades: string[];
  texto: string;
  fundadora?: boolean;
  categorias: string[];
  historia: string[];
}

export const equipo: Profesional[] = [
  {
    nombre: "Helen",
    cargo: "Esteticista",
    especialidades: ["Estética facial", "Estética corporal", "Uñas"],
    texto: "Tratamientos faciales y corporales con aparatología profesional, y cuidado experto de manos y pies.",
    categorias: ["tratamientos-faciales", "tratamientos-corporales", "manicura", "pedicura", "depilacion", "masajes", "diseno-de-mirada", "maquillaje"],
    historia: [
      "A Helen siempre le ha fascinado la piel: entender por qué cambia, qué necesita y cómo cuidarla para que se vea sana de verdad. Esa curiosidad la llevó a la estética, y con el tiempo a especializarse en tratamientos faciales y corporales con aparatología profesional.",
      "En cabina es tranquila y minuciosa. Antes de empezar pregunta, observa y explica cada paso, porque quiere que salgas sabiendo qué te ha hecho y cómo cuidarte en casa.",
      "Su otra pasión son las manos y los pies: le encanta el detalle de una manicura bien hecha y ver la cara de sus clientas cuando se miran las uñas al terminar.",
    ],
  },
  {
    nombre: "Carla",
    cargo: "Directora · Estilista y esteticista",
    especialidades: ["Color y corte", "Tratamientos capilares", "Estética"],
    texto: "Creó Laksmir para ofrecer un cuidado cercano y profesional. Diseña cada color y cada tratamiento a medida de cada clienta.",
    fundadora: true,
    categorias: ["peluqueria", "tratamientos-faciales", "tratamientos-corporales", "depilacion", "masajes", "diseno-de-mirada", "maquillaje"],
    historia: [
      "Lo que mueve a Carla es hacer sentir bien a los demás. Por eso se formó tanto en peluquería como en estética: no quería quedarse a medias, quería poder cuidar a cada persona de pies a cabeza.",
      "En 2020 dio el paso de abrir su propio espacio en Ripagaina. Lo llamó Laksmir, inspirándose en Lakshmi, y lo construyó con una idea muy clara: un salón cercano, donde se escucha antes de cortar y donde solo se recomienda lo que de verdad hace falta.",
      "Hoy dirige el salón y un equipo en el que confía plenamente, y sigue disfrutando como el primer día de diseñar un color a medida o de ver cómo una clienta se reencuentra con su melena.",
    ],
  },
  {
    nombre: "Erika",
    cargo: "Estilista",
    especialidades: ["Corte y peinado", "Color", "Uñas"],
    texto: "Cortes, peinados y color, además de manicura y pedicura con acabados impecables y duraderos.",
    categorias: ["peluqueria", "manicura", "pedicura"],
    historia: [
      "Erika es de las que se fijan en todo: en cómo cae el cabello, en la forma de la cara, en el estilo de cada persona. Por eso los cortes y los peinados son lo suyo: le gusta encontrar ese look que te favorece y que además es fácil de llevar en el día a día.",
      "Con el color disfruta experimentando, siempre escuchando lo que buscas y aconsejándote con sinceridad sobre lo que mejor le va a tu cabello.",
      "Y cuando deja las tijeras, se pasa a las manos: manicura y pedicura cuidadas al detalle, con el mismo mimo que pone en cada peinado.",
    ],
  },
];

export const equipoDe = (slug: string) => equipo.filter((p) => p.categorias.includes(slug));
