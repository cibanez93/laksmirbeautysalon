import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { obtenerTarjeta } from "@/lib/tarjetas";
import MenuAdmin from "../../../MenuAdmin";
import { editarTarjeta } from "../actions";
import TarjetaForm from "../TarjetaForm";

export default async function EditarTarjetaPage({ params }: PageProps<"/admin/tienda/tarjetas/[id]">) {
  const sesion = await requireSession();

  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const tarjeta = await obtenerTarjeta(id);
  if (!tarjeta) notFound();

  return (
    <>
      <MenuAdmin activa="Tienda" email={sesion.email} />
      <main className="max-w-2xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-8">Editar tarjeta regalo</h1>
        <TarjetaForm accion={editarTarjeta.bind(null, id)} inicial={tarjeta} textoBoton="Guardar cambios" />
      </main>
    </>
  );
}
