import { marcas } from "@/lib/salon";
import { requireSession } from "@/lib/session";
import MenuAdmin from "../../MenuAdmin";
import { crearProducto } from "../actions";
import ProductoForm from "../ProductoForm";

export default async function NuevoProductoPage() {
  const sesion = await requireSession();
  return (
    <>
      <MenuAdmin activa="Tienda" email={sesion.email} />
      <main className="max-w-2xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-8">Nuevo producto</h1>
        <ProductoForm accion={crearProducto} marcas={marcas} textoBoton="Crear producto" />
      </main>
    </>
  );
}
