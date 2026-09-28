"use client";
// Icono del carrito en la cabecera, con el número de artículos
import Link from "next/link";
import { useCarrito } from "./CarritoContexto";

export default function IconoCarrito() {
  const { cantidadTotal } = useCarrito();
  return (
    <Link href="/tienda/carrito" aria-label={`Carrito (${cantidadTotal} artículos)`} className="relative p-2 text-neutral-800 hover:text-dorado-oscuro">
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path d="M5 7h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 7Z" />
        <path d="M9 7V6a3 3 0 0 1 6 0v1" />
      </svg>
      {cantidadTotal > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-dorado text-white text-[11px] font-medium flex items-center justify-center">
          {cantidadTotal}
        </span>
      )}
    </Link>
  );
}
