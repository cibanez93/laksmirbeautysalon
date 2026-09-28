import { listarCategorias } from "@/lib/servicios";
import { requireSession } from "@/lib/session";
import { crearServicio } from "../../actions";
import MenuAdmin from "../../MenuAdmin";
import ServicioForm from "../../ServicioForm";

export default async function NuevoServicioPage() {
  const sesion = await requireSession();

  return (
    <>
      <MenuAdmin activa="Servicios" email={sesion.email} />
      <main className="max-w-2xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-8">Nuevo servicio</h1>
        <ServicioForm accion={crearServicio} categorias={await listarCategorias()} textoBoton="Crear servicio" />
      </main>
    </>
  );
}
