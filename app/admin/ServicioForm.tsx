"use client";
// Formulario compartido para crear y editar servicios
import Link from "next/link";
import { useActionState } from "react";
import type { EstadoFormulario } from "./actions";

interface Props {
  accion: (prev: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>;
  inicial?: {
    nombre: string;
    descripcion: string;
    precio: number | null;
    duracion_min: number | null;
    orden: number;
    activo: boolean;
  };
  textoBoton: string;
}

export default function ServicioForm({ accion, inicial, textoBoton }: Props) {
  const [estado, enviar, enviando] = useActionState(accion, undefined);

  // Si la acción devolvió un error, rellenamos con lo que se había escrito
  const v = estado?.valores;
  const valor = (campo: keyof NonNullable<Props["inicial"]>) => String(v ? v[campo] ?? "" : inicial?.[campo] ?? "");
  const activo = v ? v.activo === "on" : inicial?.activo ?? true;

  return (
    <form key={JSON.stringify(v)} action={enviar} className="flex flex-col gap-6 bg-white border border-neutral-200 p-6 md:p-8">
      <label className="campo">
        Nombre *
        <input name="nombre" required maxLength={100} defaultValue={valor("nombre")} className="input" />
      </label>

      <label className="campo">
        Descripción *
        <textarea name="descripcion" required rows={4} defaultValue={valor("descripcion")} className="input" />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <label className="campo">
          Precio (€)
          <input name="precio" inputMode="decimal" placeholder="Opcional" defaultValue={valor("precio")} className="input" />
        </label>
        <label className="campo">
          Duración (min)
          <input name="duracion_min" type="number" min={1} placeholder="Opcional" defaultValue={valor("duracion_min")} className="input" />
        </label>
        <label className="campo">
          Orden
          <input name="orden" type="number" defaultValue={valor("orden") || "0"} className="input" />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm text-neutral-700">
        <input name="activo" type="checkbox" defaultChecked={activo} className="size-4 accent-neutral-900" />
        Visible en la web
      </label>

      {estado?.error && (
        <p role="alert" className="text-sm text-red-700">{estado.error}</p>
      )}

      <div className="flex flex-wrap gap-4">
        <button type="submit" disabled={enviando} className="btn-primary">
          {enviando ? "Guardando…" : textoBoton}
        </button>
        <Link href="/admin" className="btn-secondary">Cancelar</Link>
      </div>
    </form>
  );
}
