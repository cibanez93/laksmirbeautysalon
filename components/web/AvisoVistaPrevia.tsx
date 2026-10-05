"use client";
// Aviso fijo arriba de la web para el equipo: lo ven solo quienes han entrado en el panel
// mientras la web sigue en mantenimiento (la cookie la pone proxy.ts).
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { VISTA_PREVIA } from "@/lib/vista-previa";

const sinCambios = () => () => {};
const hayVistaPrevia = () => document.cookie.split("; ").some((c) => c.startsWith(`${VISTA_PREVIA}=`));

export default function AvisoVistaPrevia() {
  // En el servidor no hay cookies del navegador: el aviso aparece al cargar en el navegador
  const visible = useSyncExternalStore(sinCambios, hayVistaPrevia, () => false);
  if (!visible) return null;

  return (
    <div role="status" className="bg-dorado text-neutral-900 text-xs sm:text-sm text-center px-4 py-2">
      <strong>Vista previa:</strong> las clientas todavía ven la página de mantenimiento.{" "}
      <Link href="/admin" className="underline underline-offset-2">Volver al panel</Link>
    </div>
  );
}
