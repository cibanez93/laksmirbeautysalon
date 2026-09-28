import { notFound } from "next/navigation";
import { obtenerFoto } from "@/lib/fotos";
import { listarCategorias } from "@/lib/servicios";
import { requireSession } from "@/lib/session";
import MenuAdmin from "../../MenuAdmin";
import { editarFoto } from "../actions";
import FormularioFoto from "../FormularioFoto";

export default async function EditarFotoPage({ params }: PageProps<"/admin/galeria/[id]">) {
  const sesion = await requireSession();

  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const foto = await obtenerFoto(id);
  if (!foto) notFound();

  return (
    <>
      <MenuAdmin activa="Galería" email={sesion.email} />
      <main className="max-w-2xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-8">Editar foto</h1>
        <FormularioFoto accion={editarFoto.bind(null, id)} categorias={await listarCategorias()} inicial={foto} />
      </main>
    </>
  );
}
