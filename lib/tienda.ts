// Datos y ayudas de la tienda online (se usan en la web y en el carrito).
// Los productos y los bonos se gestionan en el panel. El pago todavía no funciona.

export type TipoArticulo = "bono" | "tarjeta" | "producto";

export interface ArticuloCarrito {
  id: string; // "bono-12", "tarjeta-3", "producto-7"
  tipo: TipoArticulo;
  nombre: string;
  detalle?: string; // p. ej. la categoría del servicio
  precio: number; // en euros
  cantidad: number;
}

// Producto de EJEMPLO (solo se ven mientras no haya productos en el panel)
export interface ProductoEjemplo {
  slug: string;
  nombre: string;
  marca: string;
  descripcion: string;
  precio: number;
  ejemplo?: boolean;
}

// Los bonos y tarjetas regalo caducan al año de la compra
export const MESES_CADUCIDAD = 12;

// PENDIENTE: gastos de envío reales (precio y a partir de cuánto es gratis)
export const envio = { precio: 4.95, gratisDesde: 50 };

// Se ven en la tienda solo mientras Carla no haya creado productos en el panel
export const productosEjemplo: ProductoEjemplo[] = [
  { slug: "champu-reparador", nombre: "Champú reparador", marca: "Wella Professionals", descripcion: "Para cabellos dañados: limpia con suavidad y aporta fuerza desde la primera aplicación.", precio: 18.5, ejemplo: true },
  { slug: "mascarilla-nutritiva", nombre: "Mascarilla nutritiva", marca: "SP System Professional", descripcion: "Nutrición intensa para cabellos secos, con acabado suave y brillante.", precio: 24.9, ejemplo: true },
  { slug: "serum-vitamina-c", nombre: "Sérum vitamina C", marca: "Casmara", descripcion: "Ilumina y unifica el tono de la piel. Ideal para mantener los resultados del tratamiento facial.", precio: 39, ejemplo: true },
  { slug: "aceite-cuticulas", nombre: "Aceite de cutículas", marca: "Kinetics", descripcion: "Hidrata y cuida las cutículas para que tu manicura dure más.", precio: 9.9, ejemplo: true },
];

// 24.9 -> "24,90 €"
export const euros = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

// ¿Hay algo que enviar? (los bonos y tarjetas son digitales, no se envían)
export const tieneProductos = (articulos: ArticuloCarrito[]) => articulos.some((a) => a.tipo === "producto");

export function totales(articulos: ArticuloCarrito[], entrega: "recogida" | "envio") {
  const subtotal = articulos.reduce((suma, a) => suma + a.precio * a.cantidad, 0);
  const productos = articulos.filter((a) => a.tipo === "producto").reduce((suma, a) => suma + a.precio * a.cantidad, 0);
  const gastosEnvio = entrega === "envio" && tieneProductos(articulos) && productos < envio.gratisDesde ? envio.precio : 0;
  return { subtotal, gastosEnvio, total: subtotal + gastosEnvio };
}
