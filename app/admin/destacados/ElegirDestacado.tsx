"use client";
// Tarjeta de un sitio de la web: vista previa de la foto. Al pulsar «Elegir foto» se abre
// la galería en miniaturas (como en WordPress) y se elige la foto viéndola.
import Image from "next/image";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

interface Props {
  nombre: string;
  accion: (formData: FormData) => Promise<void>;
  fotos: { id: number; titulo: string; visible: boolean }[];
  servicios?: { id: number; nombre: string; categoria: string }[];
  fotoActual: number | null;
  servicioActual: number | null;
}

function BotonGuardar({ cambiado }: { cambiado: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={!cambiado || pending} className="btn-primary !px-4 !py-2 disabled:opacity-30">
      {pending ? "Guardando…" : "Guardar"}
    </button>
  );
}

export default function ElegirDestacado({ nombre, accion, fotos, servicios, fotoActual, servicioActual }: Props) {
  const [foto, setFoto] = useState(fotoActual ? String(fotoActual) : "");
  const [servicio, setServicio] = useState(servicioActual ? String(servicioActual) : "");
  const ventana = useRef<HTMLDialogElement>(null);
  const [abierta, setAbierta] = useState(false); // las miniaturas solo se cargan con la ventana abierta
  const cerrar = () => ventana.current?.close();
  const elegir = (id: string) => {
    setFoto(id);
    cerrar();
  };
  const cambiado = foto !== (fotoActual ? String(fotoActual) : "") || servicio !== (servicioActual ? String(servicioActual) : "");

  return (
    <form action={accion} className="bg-white border border-neutral-200 flex flex-col">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#E9DCCB] to-[#CDB392]">
        {foto ? (
          <Image src={`/fotos/${foto}`} alt="" fill unoptimized className="object-cover" />
        ) : (
          <span className="absolute bottom-2 left-2 bg-white/85 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-600">Foto de ejemplo</span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <p className="font-medium text-sm">{nombre}</p>
        {servicios && (
          <select name="servicio_id" value={servicio} onChange={(e) => setServicio(e.target.value)} className="input !text-sm" aria-label={`Servicio de ${nombre}`}>
            <option value="">Servicio de ejemplo</option>
            {servicios.map((s) => <option key={s.id} value={s.id}>{s.categoria} · {s.nombre}</option>)}
          </select>
        )}
        <input type="hidden" name="foto_id" value={foto} />
        <button
          type="button"
          onClick={() => { setAbierta(true); ventana.current?.showModal(); }}
          className="btn-secondary !px-4 !py-2 !text-sm"
        >
          {foto ? "Cambiar foto" : "Elegir foto"}
        </button>

        <dialog
          ref={ventana}
          onClose={() => setAbierta(false)}
          onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}
          className="m-auto w-[min(56rem,calc(100vw-2rem))] max-h-[85vh] p-0 backdrop:bg-black/50"
        >
          <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-5 py-4 flex items-center justify-between gap-4">
            <p className="font-medium">Foto para: {nombre}</p>
            <button type="button" onClick={cerrar} className="text-sm text-neutral-600 hover:underline">Cerrar</button>
          </div>
          {abierta && (
            <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 p-4">
              <li>
                <button type="button" onClick={() => elegir("")}
                  className={`relative w-full aspect-square bg-gradient-to-br from-[#E9DCCB] to-[#CDB392] text-[11px] uppercase tracking-wider text-neutral-700 ${foto === "" ? "ring-4 ring-neutral-900" : "hover:opacity-80"}`}>
                  Sin foto (ejemplo)
                </button>
              </li>
              {fotos.map((f) => (
                <li key={f.id}>
                  <button type="button" onClick={() => elegir(String(f.id))} title={f.titulo || "Sin título"}
                    className={`relative block w-full aspect-square bg-neutral-100 ${foto === String(f.id) ? "ring-4 ring-neutral-900" : "hover:opacity-80"}`}>
                    <Image src={`/fotos/${f.id}`} alt={f.titulo || "Foto sin título"} fill unoptimized sizes="20vw" className="object-cover" />
                    {!f.visible && <span className="absolute bottom-1 left-1 bg-white/90 px-1.5 text-[10px] uppercase tracking-wider">Oculta</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </dialog>
        <div className="mt-auto flex justify-end">
          <BotonGuardar cambiado={cambiado} />
        </div>
      </div>
    </form>
  );
}
