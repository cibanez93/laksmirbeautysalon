// Fotos de la galería.
// PROVISIONAL: datos de ejemplo. Cuando exista la tabla "fotos" en MySQL, Carla las subirá
// desde el panel y se leerán de la base de datos.

export interface AntesDespuesItem {
  titulo: string;
  servicio: string;
  antes?: string;
  despues?: string;
}

export interface FotoGaleria {
  texto: string;
  forma: "cuadrada" | "vertical" | "horizontal";
  src?: string;
}

export const antesDespues: AntesDespuesItem[] = [
  { titulo: "Mechas balayage", servicio: "Peluquería" },
  { titulo: "Alisado con taninos", servicio: "Peluquería" },
  { titulo: "Limpieza facial", servicio: "Tratamientos faciales" },
];

// Mezcladas, las más nuevas primero
export const fotos: FotoGaleria[] = [
  { texto: "color cobrizo", forma: "vertical" },
  { texto: "manicura semipermanente", forma: "cuadrada" },
  { texto: "recogido de novia", forma: "cuadrada" },
  { texto: "laminado de cejas", forma: "horizontal" },
  { texto: "corte bob", forma: "vertical" },
  { texto: "uñas esculpidas", forma: "cuadrada" },
  { texto: "maquillaje de evento", forma: "cuadrada" },
  { texto: "balayage rubio", forma: "vertical" },
  { texto: "lifting de pestañas", forma: "cuadrada" },
  { texto: "cabina de estética", forma: "horizontal" },
  { texto: "pedicura", forma: "cuadrada" },
  { texto: "método curly", forma: "vertical" },
];
