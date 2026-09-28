"use client";
// Botón "Regalar" de las listas de servicios: añade el bono regalo del servicio al carrito
import Link from "next/link";
import { useState } from "react";
import { useCarrito } from "./CarritoContexto";

interface Props {
  servicioId: number;
  nombre: string;
  categoria: string;
  precio: number;
}

export default function BotonRegalar({ servicioId, nombre, categoria, precio }: Props) {
  const { anadir } = useCarrito();
  const [anadido, setAnadido] = useState(false);

  if (anadido) {
    return (
      <Link href="/tienda/carrito" className="text-xs uppercase tracking-widest px-4 py-2 bg-neutral-900 text-white hover:bg-dorado-oscuro transition-colors">
        ✓ Ver carrito
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        anadir({ id: `bono-${servicioId}`, tipo: "bono", nombre: `Bono regalo: ${nombre}`, detalle: categoria, precio });
        setAnadido(true);
        setTimeout(() => setAnadido(false), 4000);
      }}
      title="Compra este servicio como bono regalo"
      className="text-xs uppercase tracking-widest px-4 py-2 bg-dorado text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
    >
      Regalar
    </button>
  );
}
