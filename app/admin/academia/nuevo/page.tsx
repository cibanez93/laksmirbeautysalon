import { requireSession } from "@/lib/session";
import MenuAdmin from "../../MenuAdmin";
import { crearCurso } from "../actions";
import CursoForm from "../CursoForm";

export default async function NuevoCursoPage() {
  const sesion = await requireSession();
  return (
    <>
      <MenuAdmin activa="Academia" email={sesion.email} />
      <main className="max-w-2xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-8">Nuevo curso</h1>
        <CursoForm accion={crearCurso} textoBoton="Crear curso" />
      </main>
    </>
  );
}
