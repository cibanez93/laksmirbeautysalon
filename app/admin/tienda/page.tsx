// Panel: productos de la tienda
import Image from "next/image";
import Link from "next/link";
import TarjetaVisual from "@/components/tienda/TarjetaVisual";
import { listarProductos } from "@/lib/productos";
import { listarTarjetas } from "@/lib/tarjetas";
import { requireSession } from "@/lib/session";
import { euros } from "@/lib/tienda";
import BotonBorrar from "../BotonBorrar";
import MenuAdmin from "../MenuAdmin";
import { alternarActivoProducto, borrarProducto, venderEnSalon } from "./actions";
import { alternarActivoTarjeta, borrarTarjeta } from "./tarjetas/actions";

export default async function AdminTiendaPage() {
  const sesion = await requireSession();
  const [lista, tarjetas] = await Promise.all([listarProductos(), listarTarjetas()]);

  return (
    <>
      <MenuAdmin activa="Tienda" email={sesion.email} />
      <main className="max-w-5xl mx-auto px-4 md:px-8 pb-16">
        {/* Tarjetas regalo */}
        <section className="mb-14">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <h1 className="text-2xl font-light">Tarjetas regalo</h1>
            <Link href="/admin/tienda/tarjetas/nueva" className="btn-primary">+ Nueva tarjeta</Link>
          </div>
          <p className="text-sm text-neutral-500 mb-6">Tarjetas con importe para gastar en el salón. Puedes subir un diseño propio para cada una.</p>
          {tarjetas.length === 0 ? (
            <p className="bg-white border border-neutral-200 p-8 text-center text-neutral-500">No hay tarjetas regalo.</p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {tarjetas.map((t) => (
                <li key={t.id} className="bg-white border border-neutral-200">
                  <div className={t.activo ? "" : "opacity-40"}>
                    <TarjetaVisual importe={t.importe} fotoId={t.foto_id} nombre={t.nombre} />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">
                      {t.nombre}
                      {!t.activo && <span className="ml-2 align-middle text-[10px] uppercase tracking-wider bg-neutral-200 text-neutral-600 px-2 py-0.5">Oculta</span>}
                    </p>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <form action={alternarActivoTarjeta.bind(null, t.id, !t.activo)}>
                        <button type="submit" className="text-neutral-600 hover:underline">{t.activo ? "Ocultar" : "Mostrar"}</button>
                      </form>
                      <Link href={`/admin/tienda/tarjetas/${t.id}`} className="text-neutral-900 hover:underline">Editar</Link>
                      <BotonBorrar id={t.id} nombre={`${t.nombre} (${t.importe} €)`} accion={borrarTarjeta} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <h2 className="text-2xl font-light">Productos</h2>
          <Link href="/admin/tienda/nuevo" className="btn-primary">+ Nuevo producto</Link>
        </div>
        <p className="text-sm text-neutral-500 mb-8">
          Los bonos regalo de servicios se configuran en cada servicio (foto, precio y «Se puede regalar»), en la sección <Link href="/admin" className="underline">Servicios</Link>.
        </p>

        {lista.length === 0 ? (
          <p className="bg-white border border-neutral-200 p-8 text-center text-neutral-500">
            Todavía no hay productos. Mientras tanto, la tienda muestra productos de ejemplo.
          </p>
        ) : (
          <ul className="bg-white border border-neutral-200 divide-y divide-neutral-200">
            {lista.map((p) => (
              <li key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4">
                <div className="relative size-16 shrink-0 bg-neutral-100">
                  {p.foto_id && <Image src={`/fotos/${p.foto_id}`} alt="" fill unoptimized className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {p.nombre}
                    {!p.activo && <span className="ml-2 align-middle text-[10px] uppercase tracking-wider bg-neutral-200 text-neutral-600 px-2 py-0.5">Oculto</span>}
                    {p.stock === 0 && <span className="ml-2 align-middle text-[10px] uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5">Agotado</span>}
                  </p>
                  <p className="text-sm text-neutral-500">{[p.marca, euros(p.precio), `stock ${p.stock}`].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="flex flex-wrap items-center gap-5 text-sm">
                  {p.stock > 0 && (
                    <form action={venderEnSalon.bind(null, p.id)}>
                      <button type="submit" title="Resta 1 del stock" className="btn-secondary !px-3 !py-1.5 !text-xs">−1 vendido en el salón</button>
                    </form>
                  )}
                  <form action={alternarActivoProducto.bind(null, p.id, !p.activo)}>
                    <button type="submit" className="text-neutral-600 hover:underline">{p.activo ? "Ocultar" : "Mostrar"}</button>
                  </form>
                  <Link href={`/admin/tienda/${p.id}`} className="text-neutral-900 hover:underline">Editar</Link>
                  <BotonBorrar id={p.id} nombre={p.nombre} accion={borrarProducto} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
