"use client";
// Botón que pide confirmación antes de borrar
import { borrarServicio } from "./actions";

export default function BotonBorrar({ id, nombre }: { id: number; nombre: string }) {
  return (
    <form
      action={borrarServicio.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`¿Seguro que quieres borrar "${nombre}"? No se puede deshacer.`)) e.preventDefault();
      }}
    >
      <button type="submit" className="text-red-700 hover:underline">Borrar</button>
    </form>
  );
}
