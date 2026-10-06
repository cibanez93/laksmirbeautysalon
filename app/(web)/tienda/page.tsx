// Página de TIENDA: solo los productos de belleza que se venden en el salón.
// Las tarjetas regalo y los bonos de servicios están en la página de Servicios; los cursos, en Academia.
// Los productos se gestionan en el panel. Junto con Servicios y Academia, es donde se ven precios (obligatorio para vender).
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import BotonAnadir from "@/components/tienda/BotonAnadir";
import { Adorno, FotoDestacada, FotoPendiente, TituloSeccion } from "@/components/web/decoracion";
import { listarProductosActivos, type Producto } from "@/lib/productos";
import { euros, productosEjemplo } from "@/lib/tienda";

export const metadata: Metadata = {
  title: "Tienda de productos de belleza | Laksmir Beauty Salon, Ripagaina",
  description: "Los productos profesionales de cabello, piel y uñas que usamos en Laksmir Beauty Salon. Recógelos en el salón de Ripagaina (Pamplona) o te los enviamos a casa.",
};

async function getProductos(): Promise<Producto[]> {
  try {
    return await listarProductosActivos();
  } catch (error) {
    console.error("Error al traer los productos:", error);
    return [];
  }
}

export default async function TiendaPage() {
  await connection();
  const productos = await getProductos();

  return (
    <>
      {/* Portada */}
      <section className="bg-neutral-900 text-white px-4 md:px-8 py-16 md:py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-dorado mb-4">Tienda online</p>
        <h1 className="font-serif text-4xl md:text-6xl mb-6">Lo que usamos en el salón</h1>
        <p className="text-neutral-300 text-lg max-w-xl mx-auto">
          Productos profesionales para cuidar tu cabello, tu piel y tus uñas en casa. Recógelos en el salón o te los enviamos.
        </p>
        <p className="text-sm text-neutral-400 mt-6">
          ¿Buscas un regalo? Las <Link href="/servicios#regalar" className="text-dorado underline underline-offset-2 hover:text-white">tarjetas regalo</Link> están en Servicios.
        </p>
      </section>

      {/* Productos */}
      <section id="productos" className="scroll-mt-24 px-4 md:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <TituloSeccion antetitulo="Cabello, piel y uñas" titulo="Productos" />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.length > 0
              ? productos.map((p) => (
                  <li key={p.id} className="bg-white border border-linea flex flex-col">
                    <div className="relative">
                      <FotoDestacada id={p.foto_id} texto={p.nombre} className="aspect-square" />
                      {p.stock === 0 && <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[10px] uppercase tracking-wider px-2 py-0.5">Agotado</span>}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      {p.marca && <p className="text-[11px] uppercase tracking-widest text-dorado-oscuro mb-1">{p.marca}</p>}
                      <h3 className="font-serif text-lg mb-2">{p.nombre}</h3>
                      <p className="text-sm text-neutral-600 leading-relaxed mb-4 flex-1 whitespace-pre-line">{p.descripcion}</p>
                      <p className="font-serif text-xl mb-3">{euros(p.precio)}</p>
                      {p.stock > 0 ? (
                        <BotonAnadir articulo={{ id: `producto-${p.id}`, tipo: "producto", nombre: p.nombre, detalle: p.marca, precio: p.precio }} />
                      ) : (
                        <p className="text-center text-xs uppercase tracking-widest px-4 py-3 border border-linea text-neutral-500">Agotado</p>
                      )}
                    </div>
                  </li>
                ))
              : productosEjemplo.map((p) => (
                  <li key={p.slug} className="bg-white border border-linea flex flex-col">
                    <div className="relative">
                      <FotoPendiente texto={p.nombre.toLowerCase()} className="aspect-square" />
                      <span className="absolute top-2 left-2 bg-dorado text-white text-[10px] uppercase tracking-wider px-2 py-0.5">Ejemplo</span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[11px] uppercase tracking-widest text-dorado-oscuro mb-1">{p.marca}</p>
                      <h3 className="font-serif text-lg mb-2">{p.nombre}</h3>
                      <p className="text-sm text-neutral-600 leading-relaxed mb-4 flex-1">{p.descripcion}</p>
                      <p className="font-serif text-xl mb-3">{euros(p.precio)}</p>
                      <BotonAnadir articulo={{ id: `producto-ejemplo-${p.slug}`, tipo: "producto", nombre: p.nombre, detalle: p.marca, precio: p.precio }} />
                    </div>
                  </li>
                ))}
          </ul>
          <Adorno className="mt-16" />
        </div>
      </section>
    </>
  );
}
