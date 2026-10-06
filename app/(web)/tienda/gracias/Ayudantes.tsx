"use client";
// Piezas pequeñas de la página de «Gracias» que necesitan el navegador
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCarrito } from "@/components/tienda/CarritoContexto";

// Cuando el pago está confirmado, el carrito se vacía
export function VaciarCarrito() {
  const { vaciar } = useCarrito();
  useEffect(() => vaciar(), [vaciar]);
  return null;
}

// Mientras Stripe confirma el pago (suele tardar unos segundos), la página se recarga sola
export function RecargarEnUnosSegundos() {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(id);
  }, [router]);
  return null;
}

export function BotonImprimir() {
  return (
    <button type="button" onClick={() => window.print()} className="border border-neutral-900 text-sm uppercase tracking-widest px-6 py-3 hover:bg-neutral-900 hover:text-white transition-colors print:hidden">
      Imprimir o guardar en PDF
    </button>
  );
}
