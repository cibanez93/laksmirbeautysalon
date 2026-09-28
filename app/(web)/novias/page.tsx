// Página de NOVIAS: packs cerrados (sin precio), calendario, invitadas, galería y preguntas.
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Adorno, FotoDestacada, FotoPendiente, TituloSeccion } from "@/components/web/decoracion";
import { obtenerDestacadosSeguro } from "@/lib/destacados";
import { calendario, packs, preguntasNovias } from "@/lib/novias";
import EligePack from "./EligePack";

export const metadata: Metadata = {
  title: "Peluquería y maquillaje de novia en Ripagaina, Pamplona | Laksmir Beauty Salon",
  description: "Packs de novia con peinado, maquillaje, manicura y tratamientos previos a la boda en Ripagaina (Pamplona). También invitadas y madrinas.",
};

const datosGoogle = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: preguntasNovias.map((p) => ({ "@type": "Question", name: p.pregunta, acceptedAnswer: { "@type": "Answer", text: p.respuesta } })),
};

export default async function NoviasPage() {
  await connection();
  const d = await obtenerDestacadosSeguro();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datosGoogle) }} />

      {/* Portada oscura, elegante */}
      <section className="bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2">
          <div className="relative px-6 md:px-14 py-16 md:py-24 flex flex-col justify-center order-2 md:order-1">
            <div aria-hidden="true" className="pointer-events-none absolute inset-5 border border-dorado/40" />
            <p className="text-xs uppercase tracking-[0.3em] text-dorado mb-4">Bodas y eventos</p>
            <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">Novias Laksmir</h1>
            <p className="text-neutral-300 text-lg leading-relaxed mb-10 max-w-md">
              Peinado y maquillaje de novia en Ripagaina, Pamplona. Te acompañamos desde la prueba hasta el gran día para que solo te preocupes de disfrutar.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#packs" className="bg-dorado text-neutral-900 text-sm uppercase tracking-widest px-8 py-4 hover:bg-white transition-colors">Ver los packs</a>
              <a href="#pedir-info" className="border border-dorado text-dorado text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado hover:text-neutral-900 transition-colors">Pedir información</a>
            </div>
          </div>
          <FotoDestacada id={d.novias?.foto_id} texto="Novia peinada y maquillada" className="aspect-[4/3] md:aspect-auto md:min-h-[560px] order-1 md:order-2" />
        </div>
      </section>

      {/* Packs */}
      <section id="packs" className="scroll-mt-24 bg-white py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <TituloSeccion antetitulo="Elige el tuyo" titulo="Packs de novia" />
          <p className="text-center text-neutral-600 max-w-xl mx-auto -mt-4 mb-16">
            Tres packs pensados para cada novia. Elige uno y te enviamos todos los detalles y el presupuesto por WhatsApp.
          </p>
          <EligePack packs={packs} />
        </div>
      </section>

      {/* Calendario antes de la boda */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <TituloSeccion antetitulo="Paso a paso" titulo="Tu calendario antes de la boda" />
          <ol className="relative border-l border-dorado ml-3 space-y-10">
            {calendario.map((c, i) => (
              <li key={c.cuando} className="pl-8 relative">
                <span className={`absolute -left-[7px] top-1.5 size-3 rotate-45 ${i === calendario.length - 1 ? "bg-neutral-900" : "bg-dorado"}`} aria-hidden="true" />
                <p className="text-xs uppercase tracking-[0.25em] text-dorado-oscuro mb-1">{c.cuando}</p>
                <p className="font-serif text-xl leading-snug">{c.que}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Invitadas y madrinas */}
      <section className="bg-arena py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 -translate-x-4 -translate-y-4 border border-dorado" />
            <FotoPendiente texto="madrina e invitadas" className="relative aspect-[4/3]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-3">También para ellas</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Invitadas y madrinas</h2>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Mamá, hermanas, damas de honor y amigas: peinado y maquillaje para que todas luzcáis perfectas. Organizamos los horarios para que estéis listas a tiempo y sin prisas.
            </p>
            <ul className="space-y-2 text-sm text-neutral-700 mb-8">
              {["Peinados y recogidos", "Maquillaje para eventos", "Manicura", "Diseño de mirada"].map((t) => (
                <li key={t} className="flex gap-3"><span className="text-dorado" aria-hidden="true">◆</span>{t}</li>
              ))}
            </ul>
            <a href="#pedir-info" className="inline-block bg-neutral-900 text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado-oscuro transition-colors">
              Pedir información
            </a>
          </div>
        </div>
      </section>

      {/* Galería de novias */}
      <section className="bg-white py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <TituloSeccion antetitulo="Nuestras novias" titulo="Galería de novias" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {["recogido", "maquillaje", "detalle del peinado", "novia completa", "manicura", "semirrecogido", "maquillaje natural", "novia con velo"].map((t, i) => (
              <FotoPendiente key={t} texto={t} className={i === 0 || i === 5 ? "row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-square"} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/galeria" className="text-sm uppercase tracking-widest border-b border-neutral-900 pb-1 hover:text-dorado-oscuro hover:border-dorado-oscuro">Ver toda la galería</Link>
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <TituloSeccion antetitulo="Resolvemos tus dudas" titulo="Preguntas frecuentes" />
          <div className="divide-y divide-linea border-y border-linea">
            {preguntasNovias.map((p) => (
              <details key={p.pregunta} className="group py-5">
                <summary className="list-none cursor-pointer flex items-center justify-between gap-6 font-serif text-lg">
                  {p.pregunta}
                  <span aria-hidden="true" className="shrink-0 text-dorado text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-neutral-600 leading-relaxed">{p.respuesta}</p>
              </details>
            ))}
          </div>
          <Adorno className="mt-12" />
        </div>
      </section>
    </>
  );
}
