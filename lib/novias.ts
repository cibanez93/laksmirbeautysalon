// Contenido de la página de Novias.
// BORRADOR: los packs, el calendario y las respuestas los tiene que revisar Carla antes de publicar.
// Los servicios de cada pack existen en Booksy.

export interface Pack {
  id: string;
  nombre: string;
  lema: string;
  incluye: string[];
  destacado?: boolean;
}

export const packs: Pack[] = [
  {
    id: "esencial",
    nombre: "Esencial",
    lema: "Lo imprescindible para el gran día",
    incluye: ["Prueba de peinado y maquillaje", "Peinado de novia", "Maquillaje de novia"],
  },
  {
    id: "completo",
    nombre: "Completo",
    lema: "Llega al día de tu boda radiante",
    destacado: true,
    incluye: [
      "Todo el pack Esencial",
      "Limpieza facial profunda",
      "Lifting y tinte de pestañas",
      "Manicura rusa con semipermanente",
    ],
  },
  {
    id: "premium",
    nombre: "Premium",
    lema: "Cuidado total en los meses previos",
    incluye: [
      "Todo el pack Completo",
      "Diagnóstico facial y tratamiento personalizado",
      "Color o mechas a medida",
      "Pedicura ritual Laksmir",
      "Masaje relax antes de la boda",
    ],
  },
];

export const calendario = [
  { cuando: "3 meses antes", que: "Diagnóstico facial y primeras sesiones de tratamiento para que tu piel llegue en su mejor momento." },
  { cuando: "2 meses antes", que: "Prueba de peinado y maquillaje: decidimos juntas el look según tu vestido y tu estilo." },
  { cuando: "1 mes antes", que: "Color, mechas o tratamiento capilar para que el cabello tenga tiempo de asentarse." },
  { cuando: "La semana de la boda", que: "Limpieza facial, lifting de pestañas, manicura y pedicura." },
  { cuando: "El gran día", que: "Peinado y maquillaje de novia. Solo tienes que disfrutar." },
];

export const preguntasNovias = [
  { pregunta: "¿Cuándo tengo que reservar?", respuesta: "Cuanto antes, mejor: las fechas de temporada de bodas se llenan rápido. Lo ideal es escribirnos en cuanto tengas la fecha." },
  { pregunta: "¿Cuándo se hace la prueba?", respuesta: "Normalmente uno o dos meses antes de la boda, cuando ya tienes el vestido y una idea del estilo." },
  { pregunta: "¿Podéis peinar y maquillar también a mi familia y amigas?", respuesta: "Sí. Cuéntanos cuántas personas sois y organizamos el horario para que todas estéis listas a tiempo." },
  { pregunta: "¿Os desplazáis al lugar de la boda?", respuesta: "Escríbenos con la fecha y el lugar y te lo confirmamos." },
];
