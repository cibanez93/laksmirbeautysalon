// Panel: cursos de Laksmir Academy
import Image from "next/image";
import Link from "next/link";
import { formatos, publicos } from "@/lib/academia";
import { fechaBonita, listarCursos } from "@/lib/cursos";
import { requireSession } from "@/lib/session";
import { euros } from "@/lib/tienda";
import BotonBorrar from "../BotonBorrar";
import MenuAdmin from "../MenuAdmin";
import { alternarActivoCurso, borrarCurso } from "./actions";

export default async function AdminAcademiaPage() {
  const sesion = await requireSession();
  const lista = await listarCursos();
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <>
      <MenuAdmin activa="Academia" email={sesion.email} />
      <main className="max-w-5xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <h1 className="text-2xl font-light">Cursos de Laksmir Academy</h1>
          <Link href="/admin/academia/nuevo" className="btn-primary">+ Nuevo curso</Link>
        </div>
        <p className="text-sm text-neutral-500 mb-8">
          Los cursos presenciales desaparecen solos de la web cuando pasa su fecha. Mientras no haya ningún curso, la web enseña cursos de ejemplo.
        </p>

        {lista.length === 0 ? (
          <p className="bg-white border border-neutral-200 p-8 text-center text-neutral-500">
            Todavía no hay cursos. <Link href="/admin/academia/nuevo" className="underline">Crea el primero</Link>.
          </p>
        ) : (
          <ul className="space-y-3">
            {lista.map((c) => {
              const pasado = c.fecha !== null && c.fecha.slice(0, 10) < hoy;
              return (
                <li key={c.id} className={`bg-white border border-neutral-200 flex gap-4 p-3 ${c.activo && !pasado ? "" : "opacity-60"}`}>
                  <div className="relative w-24 sm:w-32 aspect-[3/2] shrink-0 bg-neutral-100">
                    {c.foto_id && <Image src={`/fotos/${c.foto_id}`} alt="" fill unoptimized sizes="128px" className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {c.nombre}
                      {!c.activo && <span className="ml-2 align-middle text-[10px] uppercase tracking-wider bg-neutral-200 text-neutral-600 px-2 py-0.5">Oculto</span>}
                      {pasado && <span className="ml-2 align-middle text-[10px] uppercase tracking-wider bg-neutral-200 text-neutral-600 px-2 py-0.5">Ya pasó</span>}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {[
                        publicos[c.publico],
                        formatos[c.formato],
                        c.fecha && fechaBonita(c.fecha),
                        c.plazas !== null && `${c.plazas_libres} de ${c.plazas} plazas libres`,
                        euros(c.precio),
                      ].filter(Boolean).join(" · ")}
                    </p>
                    <div className="flex items-center gap-5 text-sm mt-2">
                      <Link href={`/admin/academia/${c.id}`} className="text-neutral-900 hover:underline">Editar</Link>
                      <form action={alternarActivoCurso.bind(null, c.id, !c.activo)}>
                        <button type="submit" className="text-neutral-600 hover:underline">{c.activo ? "Ocultar" : "Mostrar"}</button>
                      </form>
                      <BotonBorrar id={c.id} nombre={c.nombre} accion={borrarCurso} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
