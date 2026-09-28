import { notFound } from "next/navigation";
import { obtenerProducto } from "@/lib/productos";
import { marcas } from "@/lib/salon";
import { requireSession } from "@/lib/session";
import MenuAdmin from "../../MenuAdmin";
import { editarProducto } from "../actions";
import ProductoForm from "../ProductoForm";

export default async function EditarProductoPage({ params }: PageProps<"/admin/tienda/[id]">) {
  const sesion = await requireSession();

  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const producto = await obtenerProducto(id);
  if (!producto) notFound();

  return (
    <>
      <MenuAdmin activa="Tienda" email={sesion.email} />
      <main className="max-w-2xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-8">Editar producto</h1>
        <ProductoForm accion={editarProducto.bind(null, id)} marcas={marcas} inicial={producto} textoBoton="Guardar cambios" />
      </main>
    </>
  );
}
