// Datos del salón en un solo sitio: si algo cambia (teléfono, horario...), se cambia aquí
// y se actualiza en toda la web.

export const salon = {
  nombre: "Laksmir Beauty Salon",
  telefono: "948 04 21 90",
  telefonoEnlace: "tel:+34948042190",
  direccion: { calle: "Calle la Valeta 1", cp: "31621", localidad: "Ripagaina", provincia: "Navarra" },
  instagram: { usuario: "@laksmirbeauty", url: "https://www.instagram.com/laksmirbeauty/" },
  booksy: "https://booksy.com/es-es/17203_laksmir-beauty_peluqueria_54309_sarriguren",
  // WhatsApp (con prefijo 34, sin espacios ni +). Es el fijo del salón, con WhatsApp Business.
  whatsapp: "34948042190",
  web: "https://www.laksmirbeautysalon.com",
  horario: [
    { dias: "Lunes", horas: "13:00 – 20:00" },
    { dias: "Martes a viernes", horas: "10:00 – 20:00" },
    { dias: "Sábados", horas: "9:00 – 13:00" },
    { dias: "Domingos", horas: "Cerrado" },
  ],
  // El mismo horario en formato para calcular "abierto ahora". 0 = domingo, 1 = lunes...
  // [abre, cierra] en horas; null = cerrado
  horarioPorDia: [null, [13, 20], [10, 20], [10, 20], [10, 20], [10, 20], [9, 13]] as ([number, number] | null)[],
  mapas: {
    comoLlegar: "https://www.google.com/maps/dir/?api=1&destination=Laksmir+Beauty,+Calle+la+Valeta+1,+31621+Pamplona,+Navarra",
    embed: "https://www.google.com/maps?q=Laksmir+Beauty,+Calle+la+Valeta+1,+31621+Pamplona,+Navarra&output=embed",
  },
  // Valores de reserva: la web los usa si no puede leer las opiniones actuales (ver lib/opiniones.ts)
  opiniones: {
    google: { nota: "4,7", total: 142 },
    booksy: { nota: "5,0", total: 405 },
  },
};

export const menu = [
  { texto: "Servicios", href: "/servicios" },
  { texto: "Novias", href: "/novias" },
  { texto: "Galería", href: "/galeria" },
  { texto: "Nosotras", href: "/nosotras" },
  { texto: "Blog", href: "/blog" },
  { texto: "Contacto", href: "/contacto" },
];
