// Página de una CATEGORÍA: /servicios/peluqueria, /servicios/manicura...
// Pensada para Google: título con la zona, texto de presentación, preguntas frecuentes.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Adorno, FotoDestacada, TituloSeccion } from "@/components/web/decoracion";
import AbrirAsistente from "@/components/web/chat/AbrirAsistente";
import ServicioFila from "@/components/web/ServicioFila";
import TarjetaProfesional from "@/components/web/TarjetaProfesional";
import { categoriaPorSlug, categorias, duracionBonita, nombreBonito } from "@/lib/categorias";
import { obtenerDestacadosSeguro } from "@/lib/destacados";
import { equipoDe } from "@/lib/equipo";
import { salon } from "@/lib/salon";
import { listarServiciosActivos } from "@/lib/servicios";

export async function generateMetadata({ params }: PageProps<"/servicios/[categoria]">): Promise<Metadata> {
  const categoria = categoriaPorSlug((await params).categoria);
  if (!categoria) return {};
  return {
    title: `${categoria.nombre} en Ripagaina, Pamplona | Laksmir Beauty Salon`,
    description: `${categoria.intro} ${categoria.nombre} en Laksmir Beauty Salon, Ripagaina (Pamplona). Reserva tu cita online.`,
  };
}

async function getServicios(slug: string) {
  await connection();
  try {
    const servicios = await listarServiciosActivos();
    return servicios
      .filter((s) => s.categoria === slug)
      .map((s) => ({ id: s.id, nombre: nombreBonito(s.nombre), descripcion: s.descripcion, duracion: duracionBonita(s.duracion_min), fotoId: s.foto_id }));
  } catch (error) {
    console.error("Error al traer los servicios:", error);
    return null;
  }
}

export default async function CategoriaPage({ params }: PageProps<"/servicios/[categoria]">) {
  const categoria = categoriaPorSlug((await params).categoria);
  if (!categoria) notFound();

  const servicios = await getServicios(categoria.slug);
  const d = await obtenerDestacadosSeguro();
  const profesionales = equipoDe(categoria.slug);
  const otras = categorias.filter((c) => c.slug !== categoria.slug);

  // Preguntas frecuentes en formato que entiende Google (pueden salir en los resultados)
  const datosGoogle = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categoria.preguntas.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datosGoogle) }} />

      {/* Portada de la categoría */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center px-4 md:px-8 py-12 md:py-20">
        <div>
          <nav aria-label="Estás en" className="text-xs uppercase tracking-wider text-neutral-500 mb-6">
            <Link href="/servicios" className="hover:text-dorado-oscuro">Servicios</Link>
            <span className="mx-2 text-dorado">/</span>
            <span className="text-neutral-800">{categoria.nombre}</span>
          </nav>
          <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-4">Ripagaina · Pamplona</p>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6">{categoria.nombre} en Ripagaina</h1>
          <p className="text-neutral-600 text-lg leading-relaxed mb-10">{categoria.presentacion}</p>
          <div className="flex flex-wrap gap-4">
            <a href={salon.booksy} target="_blank" rel="noopener noreferrer" className="bg-neutral-900 text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado-oscuro transition-colors">
              Reservar cita
            </a>
            <AbrirAsistente className="border border-neutral-900 text-sm uppercase tracking-widest px-8 py-4 hover:bg-neutral-900 hover:text-white transition-colors">
              ¿Qué me recomiendas?
            </AbrirAsistente>
          </div>
        </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute inset-0 translate-x-4 -translate-y-4 rounded-t-full border border-dorado" />
          <FotoDestacada id={d[`categoria-${categoria.slug}`]?.foto_id} texto={categoria.nombre} className="relative aspect-[4/5] rounded-t-full" />
        </div>
      </section>

      {/* Servicios */}
      <section className="bg-white py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <TituloSeccion antetitulo={categoria.nombre} titulo="Nuestros servicios" />
          {servicios === null ? (
            <p className="text-center text-neutral-500">No se han podido cargar los servicios. Inténtalo de nuevo más tarde.</p>
          ) : servicios.length === 0 ? (
            <p className="text-center text-neutral-500">Muy pronto publicaremos los servicios de esta categoría.</p>
          ) : (
            <ul className="divide-y divide-linea border-y border-linea">
              {servicios.map((s) => <ServicioFila key={s.id} servicio={s} completo />)}
            </ul>
          )}
        </div>
      </section>

      {/* Quién te atiende */}
      {profesionales.length > 0 && (
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <TituloSeccion antetitulo="Quién te atiende" titulo="Profesionales a tu cuidado" />
            <div className={`grid gap-8 md:gap-6 ${profesionales.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 max-w-3xl mx-auto"}`}>
              {profesionales.map((p) => <TarjetaProfesional key={p.nombre} p={p} destacar={false} fotoId={d[`equipo-${p.nombre.toLowerCase()}`]?.foto_id} />)}
            </div>
          </div>
        </section>
      )}

      {/* Preguntas frecuentes */}
      <section className="bg-white py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <TituloSeccion antetitulo="Resolvemos tus dudas" titulo="Preguntas frecuentes" />
          <div className="divide-y divide-linea border-y border-linea">
            {categoria.preguntas.map((p) => (
              <details key={p.pregunta} className="group py-5">
                <summary className="list-none cursor-pointer flex items-center justify-between gap-6 font-serif text-lg">
                  {p.pregunta}
                  <span aria-hidden="true" className="shrink-0 text-dorado text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-neutral-600 leading-relaxed">{p.respuesta}</p>
              </details>
            ))}
          </div>
          <p className="text-center text-sm text-neutral-600 mt-8">
            ¿Tienes otra pregunta?{" "}
            <AbrirAsistente className="text-dorado-oscuro underline underline-offset-2 hover:text-neutral-900">Pregunta a nuestra asistente</AbrirAsistente>
          </p>
        </div>
      </section>

      {/* Otras categorías */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-3">Sigue descubriendo</p>
          <h2 className="font-serif text-3xl mb-4">Otros servicios</h2>
          <Adorno className="mb-10" />
          <ul className="flex flex-wrap justify-center gap-3">
            {otras.map((c) => (
              <li key={c.slug}>
                <Link href={`/servicios/${c.slug}`} className="inline-block border border-linea bg-white px-5 py-3 font-serif text-lg hover:border-dorado hover:text-dorado-oscuro transition-colors">
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
