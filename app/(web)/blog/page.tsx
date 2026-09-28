// Página del BLOG: lista estilo revista con filtro por tema.
// Los artículos se escriben y publican desde el panel.
import type { Metadata } from "next";
import { connection } from "next/server";
import { TituloSeccion } from "@/components/web/decoracion";
import { listarPublicados, type Articulo } from "@/lib/articulos";
import { fechaBonita, minutosLectura, temasBlog } from "@/lib/blog";
import ListaArticulos from "./ListaArticulos";

export const metadata: Metadata = {
  title: "Blog de belleza: consejos de cabello, piel y uñas | Laksmir Beauty Salon",
  description: "Consejos del equipo de Laksmir Beauty Salon en Ripagaina (Pamplona) para cuidar tu cabello, tu piel y tus uñas.",
};

async function getArticulos(): Promise<Articulo[]> {
  await connection();
  try {
    return await listarPublicados();
  } catch (error) {
    console.error("Error al traer los artículos:", error);
    return [];
  }
}

export default async function BlogPage() {
  const lista = (await getArticulos()).map((a) => ({
    slug: a.slug,
    titulo: a.titulo,
    resumen: a.resumen,
    tema: a.tema,
    fecha: a.fecha,
    fechaTexto: fechaBonita(a.fecha),
    minutos: minutosLectura(a.contenido),
  }));

  return (
    <section className="px-4 md:px-8 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <TituloSeccion as="h1" antetitulo="Consejos del equipo" titulo="Blog de belleza" />
        <p className="text-center text-neutral-600 max-w-xl mx-auto -mt-4 mb-10">
          Trucos y consejos para cuidar tu cabello, tu piel y tus uñas entre visita y visita.
        </p>
        {lista.length === 0 ? (
          <p className="text-center text-neutral-500 py-10">Muy pronto publicaremos nuestros primeros consejos. ¡Vuelve a visitarnos!</p>
        ) : (
          <ListaArticulos articulos={lista} temas={temasBlog} />
        )}
      </div>
    </section>
  );
}
