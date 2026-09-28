"use client";
// Tarjeta de un sitio de la web: vista previa de la foto y desplegables para cambiarla
import Image from "next/image";
import { useState } from "react";
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
        <select name="foto_id" value={foto} onChange={(e) => setFoto(e.target.value)} className="input !text-sm" aria-label={`Foto de ${nombre}`}>
          <option value="">Foto de ejemplo</option>
          {fotos.map((f) => <option key={f.id} value={f.id}>{f.titulo}{f.visible ? "" : " (oculta en la galería)"}</option>)}
        </select>
        <div className="mt-auto flex justify-end">
          <BotonGuardar cambiado={cambiado} />
        </div>
      </div>
    </form>
  );
}
