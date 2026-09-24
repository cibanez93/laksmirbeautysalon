import Link from "next/link";
import { requireSession } from "@/lib/session";
import { listarServicios } from "@/lib/servicios";
import { alternarActivo, logout } from "./actions";
import BotonBorrar from "./BotonBorrar";

const euros = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export default async function AdminPage() {
  const sesion = await requireSession();
  const servicios = await listarServicios();

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-light">Servicios</h1>
          <p className="text-sm text-neutral-500">Conectada como {sesion.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" target="_blank" className="text-sm text-neutral-600 hover:underline">Ver la web ↗</Link>
          <form action={logout}>
            <button type="submit" className="btn-secondary">Cerrar sesión</button>
          </form>
          <Link href="/admin/servicios/nuevo" className="btn-primary">+ Nuevo servicio</Link>
        </div>
      </header>

      {servicios.length === 0 ? (
        <p className="bg-white border border-neutral-200 p-8 text-center text-neutral-500">
          Todavía no hay servicios. Crea el primero con «Nuevo servicio».
        </p>
      ) : (
        <ul className="bg-white border border-neutral-200 divide-y divide-neutral-200">
          {servicios.map((s) => (
            <li key={s.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {s.nombre}
                  {!s.activo && (
                    <span className="ml-2 align-middle text-[10px] uppercase tracking-wider bg-neutral-200 text-neutral-600 px-2 py-0.5">Oculto</span>
                  )}
                </p>
                <p className="text-sm text-neutral-500">
                  {[
                    s.precio !== null && euros.format(s.precio),
                    s.duracion_min !== null && `${s.duracion_min} min`,
                    `orden ${s.orden}`,
                  ].filter(Boolean).join(" · ")}
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
      )}
    </main>
  );
}
