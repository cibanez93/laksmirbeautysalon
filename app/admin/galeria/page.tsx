// Panel: fotos de la galería
import Image from "next/image";
import Link from "next/link";
import { listarFotos, urlFoto } from "@/lib/fotos";
import { requireSession } from "@/lib/session";
import BotonBorrar from "../BotonBorrar";
import MenuAdmin from "../MenuAdmin";
import { alternarVisibleFoto, borrarFoto } from "./actions";

export default async function AdminGaleriaPage() {
  const sesion = await requireSession();
  const lista = await listarFotos({ soloVisibles: false });

  return (
    <>
      <MenuAdmin activa="Galería" email={sesion.email} />
      <main className="max-w-5xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-light">Galería</h1>
            <p className="text-sm text-neutral-500">{lista.length} fotos · los antes/después salen destacados arriba en la web</p>
          </div>
          <Link href="/admin/galeria/nueva" className="btn-primary">+ Subir foto</Link>
        </div>

        {lista.length === 0 ? (
          <p className="bg-white border border-neutral-200 p-8 text-center text-neutral-500">
            Todavía no hay fotos. Mientras tanto, la web muestra fotos de ejemplo.
          </p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lista.map((f) => (
              <li key={f.id} className="bg-white border border-neutral-200">
                <div className="relative aspect-square bg-neutral-100">
                  <Image src={urlFoto(f.id)} alt={f.titulo} fill unoptimized sizes="25vw" className={`object-cover ${f.visible ? "" : "opacity-40"}`} />
                  {f.tipo === "antes_despues" && (
                    <span className="absolute top-2 left-2 bg-white/90 text-[10px] uppercase tracking-wider px-2 py-0.5">Antes / después</span>
                  )}
                  {!f.visible && (
                    <span className="absolute top-2 right-2 bg-neutral-900 text-white text-[10px] uppercase tracking-wider px-2 py-0.5">Oculta</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{f.titulo}</p>
                  <p className="text-xs text-neutral-500 mb-3">{f.categoria ?? "Sin categoría"}</p>
                  <div className="flex items-center justify-between text-sm">
                    <form action={alternarVisibleFoto.bind(null, f.id, !f.visible)}>
                      <button type="submit" className="text-neutral-600 hover:underline">{f.visible ? "Ocultar" : "Mostrar"}</button>
                    </form>
                    <Link href={`/admin/galeria/${f.id}`} className="text-neutral-900 hover:underline">Editar</Link>
                    <BotonBorrar id={f.id} nombre={f.titulo} accion={borrarFoto} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
