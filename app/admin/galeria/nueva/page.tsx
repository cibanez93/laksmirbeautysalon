import { listarCategorias } from "@/lib/servicios";
import { requireSession } from "@/lib/session";
import MenuAdmin from "../../MenuAdmin";
import { subirFoto } from "../actions";
import FormularioFoto from "../FormularioFoto";

export default async function NuevaFotoPage() {
  const sesion = await requireSession();

  return (
    <>
      <MenuAdmin activa="Galería" email={sesion.email} />
      <main className="max-w-2xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-2">Subir foto</h1>
        <p className="text-sm text-neutral-500 mb-8">Las fotos se reducen automáticamente antes de subirlas para que la web vaya rápida.</p>
        <FormularioFoto accion={subirFoto} categorias={await listarCategorias()} />
      </main>
    </>
  );
}
