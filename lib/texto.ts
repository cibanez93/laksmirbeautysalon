// Ayudas para textos que vienen de la base de datos

// Quita las frases que hablan de dinero (la web no muestra precios).
// Las descripciones de Booksy a veces dicen "suplemento de 10€" o "el precio puede variar".
export function sinPrecios(texto: string) {
  return texto
    .split(/(?<=[.!?])\s+|\n+/)
    .filter((frase) => !/€|euro|precio|gratuit|suplemento/i.test(frase))
    .join(" ")
    .trim();
}
