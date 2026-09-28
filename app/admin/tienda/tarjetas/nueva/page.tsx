import { requireSession } from "@/lib/session";
import MenuAdmin from "../../../MenuAdmin";
import { crearTarjeta } from "../actions";
import TarjetaForm from "../TarjetaForm";

export default async function NuevaTarjetaPage() {
  const sesion = await requireSession();
  return (
    <>
      <MenuAdmin activa="Tienda" email={sesion.email} />
      <main className="max-w-2xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-8">Nueva tarjeta regalo</h1>
        <TarjetaForm accion={crearTarjeta} textoBoton="Crear tarjeta" />
      </main>
    </>
  );
}
