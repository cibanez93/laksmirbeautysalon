// Página del CARRITO
import type { Metadata } from "next";
import Carrito from "./Carrito";

export const metadata: Metadata = {
  title: "Tu carrito | Laksmir Beauty Salon",
  robots: { index: false, follow: false },
};

export default function CarritoPage() {
  return (
    <section className="px-4 md:px-8 py-16 md:py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl mb-10">Tu carrito</h1>
        <Carrito />
      </div>
    </section>
  );
}
