"use client";
// Comparador antes/después: se arrastra la barra (o se usan las flechas del teclado)
// para ver el cambio. Mientras no haya fotos reales, se ven dos fondos de ejemplo.
import Image from "next/image";
import { useState } from "react";

interface Props {
  antes?: string; // dirección de la foto, p. ej. "/fotos/12/antes"
  despues?: string;
  titulo: string;
  className?: string;
}

function Capa({ src, alt, ejemplo }: { src?: string; alt: string; ejemplo: string }) {
  return src ? (
    <Image src={src} alt={alt} fill unoptimized className="object-cover" />
  ) : (
    <div className={`absolute inset-0 ${ejemplo}`} />
  );
}

export default function AntesDespues({ antes, despues, titulo, className = "aspect-square" }: Props) {
  const [posicion, setPosicion] = useState(50);

  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      {/* Después: al fondo, se ve entero */}
      <Capa src={despues} alt={`${titulo}: después`} ejemplo="bg-gradient-to-br from-[#EBDDC8] to-[#CDAF86]" />
      {/* Antes: encima, recortado hasta la posición de la barra */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - posicion}% 0 0)` }}>
        <Capa src={antes} alt={`${titulo}: antes`} ejemplo="bg-gradient-to-br from-[#D3C3AE] to-[#A8916F]" />
      </div>

      {/* Barra y tirador */}
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${posicion}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-11 rounded-full bg-white shadow flex items-center justify-center text-dorado-oscuro">⇆</div>
      </div>
      <span className="absolute top-4 left-4 bg-white/85 text-[11px] uppercase tracking-wider px-2 py-1">Antes</span>
      <span className="absolute top-4 right-4 bg-white/85 text-[11px] uppercase tracking-wider px-2 py-1">Después</span>
      {!antes && <span className="absolute bottom-3 left-3 bg-white/80 px-2 py-1 text-[11px] uppercase tracking-wider text-neutral-600">Foto: {titulo.toLowerCase()}</span>}

      {/* Control invisible que ocupa todo: funciona con ratón, dedo y teclado */}
      <input
        type="range"
        min={0}
        max={100}
        value={posicion}
        onChange={(e) => setPosicion(Number(e.target.value))}
        aria-label={`Comparar antes y después: ${titulo}`}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
      />
    </div>
  );
}
