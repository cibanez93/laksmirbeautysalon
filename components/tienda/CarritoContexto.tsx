"use client";
// Carrito de la tienda. Se guarda en el navegador (localStorage) para que no se pierda
// al cambiar de página o volver otro día. Si el navegador no deja guardarlo, funciona igual
// mientras la página esté abierta.
import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { ArticuloCarrito } from "@/lib/tienda";

const CLAVE = "laksmir-carrito";
const VACIO: ArticuloCarrito[] = [];

// --- Pequeño "almacén" del carrito fuera de React: guarda la lista y avisa cuando cambia
let lista: ArticuloCarrito[] | null = null;
const oyentes = new Set<() => void>();

function leer(): ArticuloCarrito[] {
  if (lista === null) {
    try {
      lista = JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
    } catch {
      lista = []; // navegación privada o almacenamiento bloqueado
    }
  }
  return lista ?? VACIO;
}

function escribir(nueva: ArticuloCarrito[]) {
  lista = nueva;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(nueva));
  } catch {
    // Sin almacenamiento: el carrito vive solo mientras la página esté abierta
  }
  oyentes.forEach((avisar) => avisar());
}

function suscribir(avisar: () => void) {
  oyentes.add(avisar);
  return () => oyentes.delete(avisar);
}

// --- Contexto de React para usar el carrito en cualquier componente
interface CarritoEstado {
  articulos: ArticuloCarrito[];
  cantidadTotal: number;
  anadir: (articulo: Omit<ArticuloCarrito, "cantidad">) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
}

const Contexto = createContext<CarritoEstado | null>(null);

export function CarritoProveedor({ children }: { children: React.ReactNode }) {
  // En el servidor no hay localStorage: el carrito empieza vacío y se rellena en el navegador
  const articulos = useSyncExternalStore(suscribir, leer, () => VACIO);

  const anadir = useCallback((nuevo: Omit<ArticuloCarrito, "cantidad">) => {
    const actual = leer();
    const existe = actual.find((a) => a.id === nuevo.id);
    escribir(existe ? actual.map((a) => (a.id === nuevo.id ? { ...a, cantidad: Math.min(a.cantidad + 1, 10) } : a)) : [...actual, { ...nuevo, cantidad: 1 }]);
  }, []);

  const cambiarCantidad = useCallback((id: string, cantidad: number) => {
    escribir(leer().map((a) => (a.id === id ? { ...a, cantidad: Math.max(1, Math.min(cantidad, 10)) } : a)));
  }, []);

  const quitar = useCallback((id: string) => escribir(leer().filter((a) => a.id !== id)), []);
  const vaciar = useCallback(() => escribir([]), []);
  const cantidadTotal = articulos.reduce((suma, a) => suma + a.cantidad, 0);

  return (
    <Contexto.Provider value={{ articulos, cantidadTotal, anadir, cambiarCantidad, quitar, vaciar }}>
      {children}
    </Contexto.Provider>
  );
}

export function useCarrito() {
  const carrito = useContext(Contexto);
  if (!carrito) throw new Error("useCarrito se tiene que usar dentro de <CarritoProveedor>");
  return carrito;
}
