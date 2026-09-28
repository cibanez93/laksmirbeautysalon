import { notFound } from "next/navigation";
import { obtenerArticulo } from "@/lib/articulos";
import { temasBlog } from "@/lib/blog";
import { equipo } from "@/lib/equipo";
import { requireSession } from "@/lib/session";
import MenuAdmin from "../../MenuAdmin";
import { editarArticulo } from "../actions";
import ArticuloForm from "../ArticuloForm";

export default async function EditarArticuloPage({ params }: PageProps<"/admin/blog/[id]">) {
  const sesion = await requireSession();

  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const articulo = await obtenerArticulo(id);
  if (!articulo) notFound();

  return (
    <>
      <MenuAdmin activa="Blog" email={sesion.email} />
      <main className="max-w-3xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-8">Editar artículo</h1>
        <ArticuloForm
          accion={editarArticulo.bind(null, id)}
          temas={temasBlog}
          autoras={equipo.map((p) => p.nombre)}
          hoy={articulo.fecha}
          inicial={articulo}
          textoBoton="Guardar cambios"
        />
      </main>
    </>
  );
}
