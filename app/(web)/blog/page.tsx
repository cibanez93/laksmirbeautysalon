// Página del BLOG: lista estilo revista con filtro por tema.
import type { Metadata } from "next";
import { TituloSeccion } from "@/components/web/decoracion";
import { articulos, categoriasBlog, fechaBonita, minutosLectura } from "@/lib/blog";
import ListaArticulos from "./ListaArticulos";

export const metadata: Metadata = {
  title: "Blog de belleza: consejos de cabello, piel y uñas | Laksmir Beauty Salon",
  description: "Consejos del equipo de Laksmir Beauty Salon en Ripagaina (Pamplona) para cuidar tu cabello, tu piel y tus uñas.",
};

export default function BlogPage() {
  const lista = [...articulos]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((a) => ({ ...a, fechaTexto: fechaBonita(a.fecha), minutos: minutosLectura(a.contenido) }));

  return (
    <section className="px-4 md:px-8 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <TituloSeccion as="h1" antetitulo="Consejos del equipo" titulo="Blog de belleza" />
        <p className="text-center text-neutral-600 max-w-xl mx-auto -mt-4 mb-10">
          Trucos y consejos para cuidar tu cabello, tu piel y tus uñas entre visita y visita.
        </p>
        <ListaArticulos articulos={lista} categorias={categoriasBlog} />
      </div>
    </section>
  );
}
