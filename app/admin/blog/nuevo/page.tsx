import { temasBlog } from "@/lib/blog";
import { equipo } from "@/lib/equipo";
import { requireSession } from "@/lib/session";
import MenuAdmin from "../../MenuAdmin";
import { crearArticulo } from "../actions";
import ArticuloForm from "../ArticuloForm";

export default async function NuevoArticuloPage() {
  const sesion = await requireSession();
  const hoy = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Madrid" }); // formato AAAA-MM-DD

  return (
    <>
      <MenuAdmin activa="Blog" email={sesion.email} />
      <main className="max-w-3xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-8">Nuevo artículo</h1>
        <ArticuloForm accion={crearArticulo} temas={temasBlog} autoras={equipo.map((p) => p.nombre)} hoy={hoy} textoBoton="Guardar artículo" />
      </main>
    </>
  );
}
