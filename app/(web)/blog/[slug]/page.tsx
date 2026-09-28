// Página de un ARTÍCULO del blog
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Adorno } from "@/components/web/decoracion";
import { listarPublicados, obtenerPublicado } from "@/lib/articulos";
import { fechaBonita, minutosLectura, temaBlog } from "@/lib/blog";
import { categoriaPorSlug } from "@/lib/categorias";
import { salon } from "@/lib/salon";

// Si la base de datos falla, la página se comporta como si el artículo no existiera
const buscar = (slug: string) => obtenerPublicado(slug).catch(() => null);

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const articulo = await buscar((await params).slug);
  if (!articulo) return {};
  return { title: `${articulo.titulo} | Blog de Laksmir Beauty Salon`, description: articulo.resumen };
}

// Convierte el texto sencillo del artículo en párrafos, subtítulos y listas
function Contenido({ texto }: { texto: string }) {
  return (
    <div className="space-y-5 text-lg text-neutral-700 leading-relaxed">
      {texto.split(/\n\s*\n/).map((bloque, i) => {
        if (bloque.startsWith("## ")) {
          return <h2 key={i} className="font-serif text-2xl md:text-3xl text-neutral-900 pt-6">{bloque.slice(3)}</h2>;
        }
        if (bloque.startsWith("- ")) {
          return (
            <ul key={i} className="space-y-2">
              {bloque.split("\n").map((l) => (
                <li key={l} className="flex gap-3"><span className="text-dorado" aria-hidden="true">◆</span>{l.replace(/^- /, "")}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{bloque}</p>;
      })}
    </div>
  );
}

export default async function ArticuloPage({ params }: PageProps<"/blog/[slug]">) {
  await connection();
  const articulo = await buscar((await params).slug);
  if (!articulo) notFound();

  const tema = temaBlog(articulo.tema);
  const servicio = tema ? categoriaPorSlug(tema.servicio) : undefined;
  const otros = (await listarPublicados().catch(() => [])).filter((a) => a.slug !== articulo.slug).slice(0, 2);

  // Datos para Google: así entiende que es un artículo, quién lo escribe y cuándo
  const datosGoogle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: articulo.titulo,
    description: articulo.resumen,
    datePublished: articulo.fecha,
    author: { "@type": "Person", name: articulo.autora },
    publisher: { "@type": "Organization", name: salon.nombre },
  };

  return (
    <article className="px-4 md:px-8 py-16 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datosGoogle) }} />
      <div className="max-w-2xl mx-auto">
        <nav aria-label="Estás en" className="text-xs uppercase tracking-wider text-neutral-500 mb-10">
          <Link href="/blog" className="hover:text-dorado-oscuro">Blog</Link>
          <span className="mx-2 text-dorado">/</span>
          <span className="text-neutral-800">{tema?.nombre}</span>
        </nav>

        <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6">{articulo.titulo}</h1>
        <p className="text-xl text-neutral-600 leading-relaxed mb-8">{articulo.resumen}</p>
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Por {articulo.autora} · <time dateTime={articulo.fecha}>{fechaBonita(articulo.fecha)}</time> · {minutosLectura(articulo.contenido)} min de lectura
        </p>
        <Adorno className="justify-start my-10" />

        <Contenido texto={articulo.contenido} />

        {/* Llamada a reservar, enlazando al servicio relacionado */}
        <aside className="mt-16 bg-arena p-8 text-center">
          <p className="font-serif text-2xl mb-3">¿Quieres que te asesoremos?</p>
          <p className="text-neutral-600 mb-6">Reserva tu cita y te recomendamos lo que mejor te va.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={salon.booksy} target="_blank" rel="noopener noreferrer" className="bg-neutral-900 text-white text-sm uppercase tracking-widest px-8 py-4 hover:bg-dorado-oscuro transition-colors">Reservar cita</a>
            {servicio && (
              <Link href={`/servicios/${servicio.slug}`} className="border border-neutral-900 text-sm uppercase tracking-widest px-8 py-4 hover:bg-neutral-900 hover:text-white transition-colors">
                Ver {servicio.nombre.toLowerCase()}
              </Link>
            )}
          </div>
        </aside>

        {/* Otros artículos */}
        {otros.length > 0 && (
          <div className="mt-16">
            <p className="text-xs uppercase tracking-[0.3em] text-dorado-oscuro mb-6 text-center">Sigue leyendo</p>
            <ul className="divide-y divide-linea border-y border-linea">
              {otros.map((a) => (
                <li key={a.slug}>
                  <Link href={`/blog/${a.slug}`} className="block py-5 font-serif text-xl hover:text-dorado-oscuro">{a.titulo}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
