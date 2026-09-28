"use client";
// Botón que pide confirmación antes de borrar. Sirve para servicios, fotos y artículos:
// por defecto borra un servicio, o la acción que se le pase.
import { borrarServicio } from "./actions";

interface Props {
  id: number;
  nombre: string;
  accion?: (id: number) => Promise<void>;
}

export default function BotonBorrar({ id, nombre, accion = borrarServicio }: Props) {
  return (
    <form
      action={accion.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`¿Seguro que quieres borrar "${nombre}"? No se puede deshacer.`)) e.preventDefault();
      }}
    >
      <button type="submit" className="text-red-700 hover:underline">Borrar</button>
    </form>
  );
}
