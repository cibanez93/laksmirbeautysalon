// Página de TIENDA: tarjetas regalo, bonos regalo de servicios y productos.
// Los productos y los bonos se gestionan en el panel. El pago todavía no funciona.
// Es la única parte de la web con precios (obligatorio para vender).
import type { Metadata } from "next";
import { connection } from "next/server";
import BotonAnadir from "@/components/tienda/BotonAnadir";
import TarjetaVisual from "@/components/tienda/TarjetaVisual";
import { Adorno, FotoDestacada, FotoPendiente, TituloSeccion } from "@/components/web/decoracion";
import { categorias, duracionBonita, nombreBonito } from "@/lib/categorias";
import { listarProductosActivos, type Producto } from "@/lib/productos";
import { listarServiciosParaRegalo } from "@/lib/servicios";
import { listarTarjetasActivas, type TarjetaRegalo } from "@/lib/tarjetas";
import { euros, MESES_CADUCIDAD, productosEjemplo } from "@/lib/tienda";
import ListaBonos, { type Bono } from "./ListaBonos";

export const metadata: Metadata = {
  title: "Tienda y tarjetas regalo | Laksmir Beauty Salon, Ripagaina",
  description: "Regala belleza: bonos regalo de servicios, tarjetas regalo y productos profesionales de Laksmir Beauty Salon en Ripagaina (Pamplona).",
};

async function getBonos(): Promise<Bono[]> {
  await connection();
  try {
    const servicios = await listarServiciosParaRegalo();
    return servicios.map((s) => ({
      id: s.id,
      fotoId: s.foto_id,
      nombre: nombreBonito(s.nombre),
      categoria: categorias.find((c) => c.slug === s.categoria)?.nombre ?? "Otros",
      duracion: duracionBonita(s.duracion_min),
      precio: s.precio,
    }));
  } catch (error) {
    console.error("Error al traer los bonos:", error);
    return [];
  }
}

async function getProductos(): Promise<Producto[]> {
  try {
    return await listarProductosActivos();
  } catch (error) {
    console.error("Error al traer los productos:", error);
    return [];
  }
}

async function getTarjetas(): Promise<TarjetaRegalo[]> {
  try {
    return await listarTarjetasActivas();
  } catch (error) {
    console.error("Error al traer las tarjetas regalo:", error);
    return [];
  }
}

const pasos = [
  { titulo: "Elige tu regalo", texto: "Un servicio concreto o una tarjeta con el importe que quieras." },
  { titulo: "Recíbelo por email", texto: "Te llega al momento un bono con un código único, listo para regalar." },
  { titulo: "Reserva la cita", texto: `Quien lo recibe reserva cuando quiera. Válido durante ${MESES_CADUCIDAD === 12 ? "1 año" : `${MESES_CADUCIDAD} meses`}.` },
];

export default async function TiendaPage() {
  const [bonos, productos, tarjetas] = await Promise.all([getBonos(), getProductos(), getTarjetas()]);
  const categoriasConBonos = categorias.map((c) => c.nombre).filter((n) => bonos.some((b) => b.categoria === n));

  return (
    <>
      {/* Portada */}
      <section className="bg-neutral-900 text-white px-4 md:px-8 py-16 md:py-24 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-dorado mb-4">Tienda online</p>
        <h1 className="font-serif text-4xl md:text-6xl mb-6">Regala un momento Laksmir</h1>
        <p className="text-neutral-300 text-lg max-w-xl mx-auto mb-10">Tarjetas regalo, bonos para cualquiera de nuestros servicios y los productos profesionales que usamos en el salón.</p>
        <nav aria-label="Secciones de la tienda" className="flex flex-wrap justify-center gap-3">
          {[
            { texto: "Tarjetas regalo", href: "#tarjetas" },
            { texto: "Bonos de servicios", href: "#bonos" },
            { texto: "Productos", href: "#productos" },
          ].map((s) => (
            <a key={s.href} href={s.href} className="border border-dorado text-dorado text-xs uppercase tracking-widest px-6 py-3 hover:bg-dorado hover:text-neutral-900 transition-colors">
              {s.texto}
            </a>
          ))}
        </nav>
      </section>

      {/* Cómo funciona */}
      <section className="px-4 md:px-8 py-14 bg-arena">
        <ol className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {pasos.map((p, i) => (
            <li key={p.titulo}>
              <p className="font-serif text-4xl text-dorado mb-2">0{i + 1}</p>
              <h2 className="font-serif text-xl mb-1">{p.titulo}</h2>
              <p className="text-sm text-neutral-600">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Tarjetas regalo */}
      <section id="tarjetas" className="scroll-mt-24 px-4 md:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <TituloSeccion antetitulo="Para que elija lo que quiera" titulo="Tarjetas regalo" />
          {tarjetas.length === 0 ? (
            <p className="text-center text-neutral-500">Muy pronto podrás comprar tarjetas regalo desde aquí.</p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {tarjetas.map((t) => (
                <li key={t.id} className="flex flex-col gap-3">
                  <TarjetaVisual importe={t.importe} fotoId={t.foto_id} nombre={t.nombre} />
                  {t.nombre !== "Tarjeta regalo" && <p className="font-serif text-center -mt-1">{t.nombre}</p>}
                  <BotonAnadir articulo={{ id: `tarjeta-${t.id}`, tipo: "tarjeta", nombre: `${t.nombre} de ${euros(t.importe)}`, precio: t.importe }} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Bonos de servicios */}
      <section id="bonos" className="scroll-mt-24 bg-white px-4 md:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <TituloSeccion antetitulo="Regala un servicio concreto" titulo="Bonos regalo" />
          {bonos.length === 0 ? (
            <p className="text-center text-neutral-500">Muy pronto podrás regalar nuestros servicios desde aquí.</p>
          ) : (
            <ListaBonos bonos={bonos} categorias={categoriasConBonos} />
          )}
        </div>
      </section>

      {/* Productos */}
      <section id="productos" className="scroll-mt-24 px-4 md:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <TituloSeccion antetitulo="Lo que usamos en el salón" titulo="Productos" />
          <p className="text-center text-neutral-600 -mt-4 mb-12">Recógelos en el salón o te los enviamos a casa.</p>
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
