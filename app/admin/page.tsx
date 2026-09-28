// Panel: lista de servicios, agrupados por categoría
import Link from "next/link";
import { duracionBonita } from "@/lib/categorias";
import { listarCategorias, listarServicios } from "@/lib/servicios";
import { requireSession } from "@/lib/session";
import { euros } from "@/lib/tienda";
import { alternarActivo } from "./actions";
import BotonBorrar from "./BotonBorrar";
import MenuAdmin from "./MenuAdmin";

export default async function AdminPage() {
  const sesion = await requireSession();
  const [servicios, categorias] = await Promise.all([listarServicios(), listarCategorias()]);
  const sinCategoria = servicios.filter((s) => s.categoria_id === null);
  const grupos = [
    ...categorias.map((c) => ({ nombre: c.nombre, servicios: servicios.filter((s) => s.categoria_id === c.id) })),
    ...(sinCategoria.length ? [{ nombre: "Sin categoría", servicios: sinCategoria }] : []),
  ].filter((g) => g.servicios.length > 0);

  return (
    <>
      <MenuAdmin activa="Servicios" email={sesion.email} />
      <main className="max-w-5xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-light">Servicios</h1>
            <p className="text-sm text-neutral-500">{servicios.length} servicios · los ocultos no se ven en la web</p>
          </div>
          <Link href="/admin/servicios/nuevo" className="btn-primary">+ Nuevo servicio</Link>
        </div>

        {grupos.length === 0 ? (
          <p className="bg-white border border-neutral-200 p-8 text-center text-neutral-500">
            Todavía no hay servicios. Crea el primero con «Nuevo servicio».
          </p>
        ) : (
          <div className="space-y-10">
            {grupos.map((g) => (
              <section key={g.nombre}>
                <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">{g.nombre} · {g.servicios.length}</h2>
                <ul className="bg-white border border-neutral-200 divide-y divide-neutral-200">
                  {g.servicios.map((s) => (
                    <li key={s.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {s.nombre}
                          {!s.activo && (
                            <span className="ml-2 align-middle text-[10px] uppercase tracking-wider bg-neutral-200 text-neutral-600 px-2 py-0.5">Oculto</span>
                          )}
                          {s.regalable && (
                            <span className="ml-2 align-middle text-[10px] uppercase tracking-wider bg-dorado/15 text-dorado-oscuro px-2 py-0.5">Bono regalo</span>
                          )}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {[duracionBonita(s.duracion_min), s.regalable && s.precio !== null && `bono ${euros(s.precio)}`, s.foto_id && "con foto", `orden ${s.orden}`].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-5 text-sm">
                        <form action={alternarActivo.bind(null, s.id, !s.activo)}>
                          <button type="submit" className="text-neutral-600 hover:underline">
                            {s.activo ? "Ocultar" : "Mostrar"}
                          </button>
                        </form>
                        <Link href={`/admin/servicios/${s.id}`} className="text-neutral-900 hover:underline">Editar</Link>
                        <BotonBorrar id={s.id} nombre={s.nombre} />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
