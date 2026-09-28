"use client";
// Botón "Añadir al carrito" (dorado, el color de la marca) con confirmación visual al pulsarlo
import Link from "next/link";
import { useState } from "react";
import type { ArticuloCarrito } from "@/lib/tienda";
import { useCarrito } from "./CarritoContexto";

export default function BotonAnadir({ articulo, className = "" }: { articulo: Omit<ArticuloCarrito, "cantidad">; className?: string }) {
  const { anadir } = useCarrito();
  const [anadido, setAnadido] = useState(false);

  if (anadido) {
    return (
      <Link href="/tienda/carrito" className={`text-center text-xs uppercase tracking-widest px-4 py-3 bg-neutral-900 text-white hover:bg-dorado-oscuro transition-colors ${className}`}>
        ✓ Añadido · Ver carrito
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        anadir(articulo);
        setAnadido(true);
        setTimeout(() => setAnadido(false), 3000);
      }}
      className={`text-xs uppercase tracking-widest px-4 py-3 bg-dorado text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors ${className}`}
    >
      Añadir al carrito
    </button>
  );
}
