import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { listarCategorias, obtenerServicio } from "@/lib/servicios";
import { editarServicio } from "../../actions";
import MenuAdmin from "../../MenuAdmin";
import ServicioForm from "../../ServicioForm";

export default async function EditarServicioPage({ params }: PageProps<"/admin/servicios/[id]">) {
  const sesion = await requireSession();

  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const servicio = await obtenerServicio(id);
  if (!servicio) notFound();

  return (
    <>
      <MenuAdmin activa="Servicios" email={sesion.email} />
      <main className="max-w-2xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-8">Editar servicio</h1>
        {/* bind "fija" el id como primer argumento de la acción */}
        <ServicioForm accion={editarServicio.bind(null, id)} categorias={await listarCategorias()} inicial={servicio} textoBoton="Guardar cambios" />
      </main>
    </>
  );
}
