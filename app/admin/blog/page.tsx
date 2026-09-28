// Panel: artículos del blog
import Link from "next/link";
import { listarArticulos } from "@/lib/articulos";
import { fechaBonita, temaBlog } from "@/lib/blog";
import { requireSession } from "@/lib/session";
import BotonBorrar from "../BotonBorrar";
import MenuAdmin from "../MenuAdmin";
import { alternarPublicado, borrarArticulo } from "./actions";

export default async function AdminBlogPage() {
  const sesion = await requireSession();
  const lista = await listarArticulos();

  return (
    <>
      <MenuAdmin activa="Blog" email={sesion.email} />
      <main className="max-w-5xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-light">Blog</h1>
            <p className="text-sm text-neutral-500">{lista.length} artículos · los borradores no se ven en la web</p>
          </div>
          <Link href="/admin/blog/nuevo" className="btn-primary">+ Nuevo artículo</Link>
        </div>

        {lista.length === 0 ? (
          <p className="bg-white border border-neutral-200 p-8 text-center text-neutral-500">
            Todavía no hay artículos. Escribe el primero con «Nuevo artículo».
          </p>
        ) : (
          <ul className="bg-white border border-neutral-200 divide-y divide-neutral-200">
            {lista.map((a) => (
              <li key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {a.titulo}
                    <span className={`ml-2 align-middle text-[10px] uppercase tracking-wider px-2 py-0.5 ${a.publicado ? "bg-green-100 text-green-800" : "bg-neutral-200 text-neutral-600"}`}>
                      {a.publicado ? "Publicado" : "Borrador"}
                    </span>
                  </p>
                  <p className="text-sm text-neutral-500">{temaBlog(a.tema)?.nombre} · {a.autora} · {fechaBonita(a.fecha)}</p>
                </div>
                <div className="flex items-center gap-5 text-sm">
                  {a.publicado && <Link href={`/blog/${a.slug}`} target="_blank" className="text-neutral-600 hover:underline">Ver ↗</Link>}
                  <form action={alternarPublicado.bind(null, a.id, !a.publicado)}>
                    <button type="submit" className="text-neutral-600 hover:underline">{a.publicado ? "Despublicar" : "Publicar"}</button>
                  </form>
                  <Link href={`/admin/blog/${a.id}`} className="text-neutral-900 hover:underline">Editar</Link>
                  <BotonBorrar id={a.id} nombre={a.titulo} accion={borrarArticulo} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
