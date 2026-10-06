import { notFound } from "next/navigation";
import { obtenerCurso } from "@/lib/cursos";
import { alumnasDeCurso } from "@/lib/pedidos";
import { requireSession } from "@/lib/session";
import MenuAdmin from "../../MenuAdmin";
import { editarCurso } from "../actions";
import CursoForm from "../CursoForm";

export default async function EditarCursoPage({ params }: PageProps<"/admin/academia/[id]">) {
  const sesion = await requireSession();

  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const [curso, alumnas] = await Promise.all([obtenerCurso(id), alumnasDeCurso(id)]);
  if (!curso) notFound();
  const plazasVendidas = alumnas.reduce((suma, a) => suma + a.cantidad, 0);

  return (
    <>
      <MenuAdmin activa="Academia" email={sesion.email} />
      <main className="max-w-2xl mx-auto px-4 md:px-8 pb-16">
        <h1 className="text-2xl font-light mb-8">Editar curso</h1>
        <CursoForm accion={editarCurso.bind(null, id)} inicial={curso} textoBoton="Guardar cambios" />

        {curso.formato === "presencial" && (
          <section className="mt-12">
            <h2 className="text-xl font-light mb-1">Alumnas apuntadas ({plazasVendidas})</h2>
            <p className="text-sm text-neutral-500 mb-4">Las que han reservado y pagado su plaza en la web.</p>
            {alumnas.length === 0 ? (
              <p className="bg-white border border-neutral-200 p-6 text-center text-neutral-500">Todavía no se ha apuntado nadie online.</p>
            ) : (
              <ul className="bg-white border border-neutral-200 divide-y divide-neutral-200 text-sm">
                {alumnas.map((a) => (
                  <li key={a.pedido_id} className="px-4 py-3 flex flex-wrap justify-between gap-2">
                    <span className="font-medium">{a.nombre ?? "—"}{a.cantidad > 1 ? ` (${a.cantidad} plazas)` : ""}</span>
                    <span className="text-neutral-500">{[a.telefono, a.email].filter(Boolean).join(" · ")}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </>
  );
}
