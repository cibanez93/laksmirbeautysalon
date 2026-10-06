// Página del CARRITO
import type { Metadata } from "next";
import { connection } from "next/server";
import { pagoActivo } from "@/lib/stripe";
import Carrito from "./Carrito";

export const metadata: Metadata = {
  title: "Tu carrito | Laksmir Beauty Salon",
  robots: { index: false, follow: false },
};

export default async function CarritoPage() {
  await connection(); // se decide en cada visita si el pago está activado (variables de entorno)
  return (
    <section className="px-4 md:px-8 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl mb-10">Tu carrito</h1>
        <Carrito pagoActivo={pagoActivo()} />
      </div>
    </section>
  );
}
