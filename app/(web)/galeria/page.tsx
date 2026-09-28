// Página de GALERÍA: antes/después destacados arriba y debajo todas las fotos mezcladas.
// Las fotos se suben desde el panel; si todavía no hay ninguna, se ven fotos de ejemplo.
import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import AntesDespues from "@/components/web/AntesDespues";
import { FotoPendiente, TituloSeccion } from "@/components/web/decoracion";
import { listarFotos, urlFoto, urlFotoAntes, type Foto } from "@/lib/fotos";
import { antesDespues as ejemplosAntesDespues, fotos as ejemplosFotos } from "@/lib/galeria";
import { salon } from "@/lib/salon";

export const metadata: Metadata = {
  title: "Galería de trabajos: peluquería, uñas y estética | Laksmir Beauty Salon, Ripagaina",
  description: "Mira nuestros trabajos de color, mechas, novias, manicura y tratamientos faciales en Ripagaina (Pamplona). Antes y después reales.",
};

const formas = {
  cuadrada: "aspect-square",
  vertical: "aspect-[3/4] row-span-2",
  horizontal: "aspect-[4/3] md:col-span-2 md:aspect-[2/1]",
};

async function getFotos(): Promise<Foto[]> {
  await connection();
  try {
    return await listarFotos({ soloVisibles: true });
  } catch (error) {
    console.error("Error al traer las fotos:", error);
    return [];
  }
}

export default async function GaleriaPage() {
  const todas = await getFotos();
  const hayFotos = todas.length > 0;
  const comparaciones = hayFotos
    ? todas.filter((f) => f.tipo === "antes_despues").map((f) => ({ clave: String(f.id), titulo: f.titulo, servicio: f.categoria ?? "", antes: urlFotoAntes(f.id), despues: urlFoto(f.id) }))
    : ejemplosAntesDespues.map((a) => ({ clave: a.titulo, ...a }));
  const fotosNormales = todas.filter((f) => f.tipo === "foto");

  return (
    <>
      {/* Antes / después */}
      {comparaciones.length > 0 && (
        <section className="px-4 md:px-8 pt-16 md:pt-20 pb-20">
          <div className="max-w-6xl mx-auto">
            <TituloSeccion as="h1" antetitulo="Resultados reales" titulo="Nuestros trabajos" />
            <p className="text-center text-neutral-600 max-w-xl mx-auto -mt-4 mb-12">
              Desliza la barra de cada foto para ver el antes y el después.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {comparaciones.map((a) => (
                <figure key={a.clave}>
                  <AntesDespues titulo={a.titulo} antes={a.antes} despues={a.despues} className="aspect-[4/5]" />
                  <figcaption className="mt-4 text-center">
                    {a.servicio && <p className="text-[11px] uppercase tracking-widest text-dorado-oscuro">{a.servicio}</p>}
                    <p className="font-serif text-xl">{a.titulo}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Todas las fotos (si solo hay antes/después, esta parte no se muestra) */}
      {(!hayFotos || fotosNormales.length > 0) && (
        <section className={`bg-white px-4 md:px-8 ${comparaciones.length ? "py-20" : "pt-16 md:pt-20 pb-20"}`}>
          <div className="max-w-6xl mx-auto">
            <TituloSeccion as={comparaciones.length ? "h2" : "h1"} antetitulo="Inspírate" titulo="Galería" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 grid-flow-dense">
              {hayFotos
                ? fotosNormales.map((f) => (
                    <div key={f.id} className={`relative overflow-hidden ${formas[f.forma]}`}>
                      <Image src={urlFoto(f.id)} alt={f.titulo} fill unoptimized className="object-cover" />
                    </div>
                  ))
                : ejemplosFotos.map((f) => <FotoPendiente key={f.texto} texto={f.texto} className={formas[f.forma]} />)}
            </div>
          </div>
        </section>
      )}

      {/* Llamada final */}
      <section className="px-4 md:px-8 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-3">¿Te gusta lo que ves?</p>
        <h2 className="font-serif text-3xl md:text-4xl mb-4">Tu cambio empieza aquí</h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">Reserva tu cita o síguenos en Instagram para ver nuestros últimos trabajos.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href={salon.booksy} target="_blank" rel="noopener noreferrer" className="bg-neutral-900 text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado-oscuro transition-colors">
            Reservar cita
          </a>
          <a href={salon.instagram.url} target="_blank" rel="noopener noreferrer" className="border border-neutral-900 text-sm uppercase tracking-widest px-8 py-4 hover:bg-neutral-900 hover:text-white transition-colors">
            {salon.instagram.usuario}
          </a>
        </div>
      </section>
    </>
  );
}
