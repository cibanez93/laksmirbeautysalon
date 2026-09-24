import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { obtenerServicio } from "@/lib/servicios";
import { editarServicio } from "../../actions";
import ServicioForm from "../../ServicioForm";

export default async function EditarServicioPage({ params }: PageProps<"/admin/servicios/[id]">) {
  await requireSession();

  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const servicio = await obtenerServicio(id);
  if (!servicio) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-10">
      <h1 className="text-2xl font-light mb-8">Editar servicio</h1>
      {/* bind "fija" el id como primer argumento de la acción */}
      <ServicioForm accion={editarServicio.bind(null, id)} inicial={servicio} textoBoton="Guardar cambios" />
    </main>
  );
}
