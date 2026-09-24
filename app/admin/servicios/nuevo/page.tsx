import { requireSession } from "@/lib/session";
import { crearServicio } from "../../actions";
import ServicioForm from "../../ServicioForm";

export default async function NuevoServicioPage() {
  await requireSession();

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-10">
      <h1 className="text-2xl font-light mb-8">Nuevo servicio</h1>
      <ServicioForm accion={crearServicio} textoBoton="Crear servicio" />
    </main>
  );
}
