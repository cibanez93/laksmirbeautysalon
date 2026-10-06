// Panel: pedidos de la tienda y bonos regalo vendidos (canjear en el salón)
import { buscarBono, listarBonos, listarPedidos, type Bono } from "@/lib/pedidos";
import { requireSession } from "@/lib/session";
import { euros } from "@/lib/tienda";
import MenuAdmin from "../MenuAdmin";
import { alternarEntregado, alternarUsoBono, buscarCodigo } from "./actions";

const fecha = (d: Date | null) =>
  d ? new Date(d).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }) : "";

const caducado = (b: Bono) => b.caduca_en < new Date().toISOString().slice(0, 10);

function FilaBono({ b, destacado = false }: { b: Bono; destacado?: boolean }) {
  return (
    <li className={`bg-white border p-4 flex flex-wrap items-center gap-4 ${destacado ? "border-neutral-900" : "border-neutral-200"}`}>
      <span className="font-mono tracking-widest">{b.codigo}</span>
      <span className="flex-1 min-w-48">
        {b.descripcion} · {euros(b.importe)}
        <span className="block text-xs text-neutral-500">Pedido nº {b.pedido_id} · válido hasta {b.caduca_en.split("-").reverse().join("/")}</span>
      </span>
      {b.usado_en ? (
        <span className="text-sm text-neutral-500">Usado el {fecha(b.usado_en)}</span>
      ) : caducado(b) ? (
        <span className="text-sm text-red-700">Caducado</span>
      ) : (
        <span className="text-sm text-green-700">Sin usar</span>
      )}
      <form action={alternarUsoBono.bind(null, b.id, !b.usado_en)}>
        <button type="submit" className={b.usado_en ? "text-sm text-neutral-600 hover:underline" : "btn-primary !px-4 !py-2"}>
          {b.usado_en ? "Deshacer" : "Canjear"}
        </button>
      </form>
    </li>
  );
}

export default async function AdminPedidosPage({ searchParams }: PageProps<"/admin/pedidos">) {
  const sesion = await requireSession();
  const { codigo, noexiste } = await searchParams;
  const [pedidos, bonos, encontrado] = await Promise.all([
    listarPedidos(),
    listarBonos(),
    typeof codigo === "string" && codigo && !noexiste ? buscarBono(codigo) : null,
  ]);

  return (
    <>
      <MenuAdmin activa="Pedidos" email={sesion.email} />
      <main className="max-w-5xl mx-auto px-4 md:px-8 pb-16">
        {/* Bonos: canjear en el salón */}
        <section id="bonos" className="mb-14 scroll-mt-6">
          <h1 className="text-2xl font-light mb-2">Canjear un bono</h1>
          <p className="text-sm text-neutral-500 mb-4">Escribe el código que trae la clienta y pulsa «Canjear» cuando haga uso del regalo.</p>
          <form action={buscarCodigo} className="flex gap-2 mb-4 max-w-md">
            <input name="codigo" defaultValue={typeof codigo === "string" ? codigo : ""} placeholder="Código del bono" autoComplete="off" className="input uppercase tracking-widest" />
            <button type="submit" className="btn-primary">Buscar</button>
          </form>
          {noexiste && <p role="alert" className="text-sm text-red-700 mb-4">No hay ningún bono con ese código. Revisa que esté bien escrito.</p>}
          {encontrado && <ul className="mb-8"><FilaBono b={encontrado} destacado /></ul>}

          <h2 className="text-sm uppercase tracking-widest text-neutral-500 mt-8 mb-3">Últimos bonos vendidos</h2>
          {bonos.length === 0 ? (
            <p className="bg-white border border-neutral-200 p-6 text-center text-neutral-500">Todavía no se ha vendido ningún bono.</p>
          ) : (
            <ul className="space-y-2">{bonos.map((b) => <FilaBono key={b.id} b={b} />)}</ul>
          )}
        </section>

        {/* Pedidos */}
        <section>
          <h2 className="text-2xl font-light mb-2">Pedidos</h2>
          <p className="text-sm text-neutral-500 mb-6">
            Los pagos y las devoluciones se gestionan en Stripe. Aquí ves qué se ha comprado y a quién hay que entregarlo.
          </p>
          {pedidos.length === 0 ? (
            <p className="bg-white border border-neutral-200 p-8 text-center text-neutral-500">Todavía no hay pedidos.</p>
          ) : (
            <ul className="space-y-3">
              {pedidos.map((p) => {
                const hayProductos = p.lineas.some((l) => l.tipo === "producto");
                return (
                  <li key={p.id} className={`bg-white border border-neutral-200 p-5 ${p.estado === "pendiente" ? "opacity-60" : ""}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <p className="font-medium">
                        Pedido nº {p.id} · {p.nombre ?? "—"}
                        {p.estado === "pendiente" && <span className="ml-2 text-[10px] uppercase tracking-wider bg-neutral-200 px-2 py-0.5">Pagando…</span>}
                      </p>
                      <p className="text-sm text-neutral-500">{fecha(p.pagado_en ?? p.creado_en)} · <strong className="text-neutral-900">{euros(p.total)}</strong></p>
                    </div>
                    <ul className="text-sm text-neutral-700 mb-2">
                      {p.lineas.map((l, i) => <li key={i}>{l.cantidad} × {l.nombre}</li>)}
                    </ul>
                    {p.estado === "pagado" && (
                      <div className="text-sm text-neutral-500 space-y-0.5">
                        <p>{[p.email, p.telefono].filter(Boolean).join(" · ")}</p>
                        {p.regalo_para && <p>Regalo para {p.regalo_para}{p.regalo_de ? ` de ${p.regalo_de}` : ""}</p>}
                        {hayProductos && <p>{p.entrega === "envio" ? `Envío a: ${p.direccion ?? "—"}` : "Recogida en el salón"}</p>}
                      </div>
                    )}
                    {p.estado === "pagado" && hayProductos && (
                      <form action={alternarEntregado.bind(null, p.id, !p.entregado)} className="mt-3">
                          <button type="submit" className={p.entregado ? "text-sm text-green-700 hover:underline" : "btn-secondary !px-4 !py-2"}>
                            {p.entregado ? `✓ ${p.entrega === "envio" ? "Enviado" : "Entregado"} (deshacer)` : `Marcar como ${p.entrega === "envio" ? "enviado" : "entregado"}`}
                          </button>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
