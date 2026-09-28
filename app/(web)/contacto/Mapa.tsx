"use client";
// Google Maps pone cookies, así que no se carga hasta que la persona lo pide (ley de privacidad).
import { useState } from "react";
import { salon } from "@/lib/salon";

export default function Mapa() {
  const [cargado, setCargado] = useState(false);

  if (cargado) {
    return (
      <iframe
        src={salon.mapas.embed}
        title="Mapa de Laksmir Beauty Salon en Google Maps"
        className="w-full h-full min-h-[380px] border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="relative w-full h-full min-h-[380px] bg-gradient-to-br from-[#E9DCCB] to-[#CDB392] flex items-center justify-center p-6">
      {/* Cuadrícula suave que recuerda a un mapa */}
      <div aria-hidden="true" className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="relative bg-white/95 p-6 text-center max-w-xs">
        <p className="text-3xl mb-2" aria-hidden="true">📍</p>
        <p className="font-serif text-xl mb-1">Laksmir Beauty Salon</p>
        <p className="text-sm text-neutral-600 mb-5">{salon.direccion.calle}, {salon.direccion.localidad}</p>
        <button type="button" onClick={() => setCargado(true)} className="w-full bg-neutral-900 text-white text-xs uppercase tracking-widest px-5 py-3 hover:bg-dorado-oscuro transition-colors">
          Ver mapa
        </button>
        <p className="text-[11px] text-neutral-500 mt-3">Al ver el mapa, Google Maps puede usar cookies.</p>
      </div>
    </div>
  );
}
