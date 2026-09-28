"use client";
// Formulario para crear y editar tarjetas regalo
import Link from "next/link";
import { useActionState, useState } from "react";
import CampoImagen from "@/components/admin/CampoImagen";
import { reducirImagenes } from "@/components/admin/reducirImagen";
import type { EstadoFormulario } from "../../actions";

interface Props {
  accion: (prev: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>;
  inicial?: { nombre: string; importe: number; orden: number; activo: boolean; foto_id: number | null; version: number };
  textoBoton: string;
}

type Campo = "nombre" | "importe" | "orden";

export default function TarjetaForm({ accion, inicial, textoBoton }: Props) {
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [estado, enviar, enviando] = useActionState(async (prev: EstadoFormulario, formData: FormData) => {
    setErrorLocal(null);
    if (!(await reducirImagenes(formData, ["imagen"]))) {
      setErrorLocal("No se ha podido leer la foto. Prueba con otra imagen (JPG o PNG).");
      return prev;
    }
    return accion(prev, formData);
  }, undefined);

  const v = estado?.valores;
  const valor = (campo: Campo) => String(v ? v[campo] ?? "" : inicial?.[campo] ?? "");
  const activo = v ? v.activo === "on" : inicial?.activo ?? true;
  const error = errorLocal ?? estado?.error;

  return (
    <form key={JSON.stringify(v)} action={enviar} className="flex flex-col gap-6 bg-white border border-neutral-200 p-6 md:p-8">
      <label className="campo">
        Nombre
        <input name="nombre" maxLength={80} placeholder="Tarjeta regalo" defaultValue={valor("nombre")} className="input" />
        <span className="normal-case tracking-normal text-neutral-400">Por ejemplo: «Tarjeta regalo», «Tarjeta Navidad» o «Día de la Madre».</span>
      </label>

      <div className="grid grid-cols-2 gap-6">
        <label className="campo">
          Importe (€) *
          <input name="importe" required inputMode="decimal" placeholder="50" defaultValue={valor("importe")} className="input" />
        </label>
        <label className="campo">
          Orden
          <input name="orden" type="number" defaultValue={valor("orden") || "0"} className="input" />
          <span className="normal-case tracking-normal text-neutral-400">Los números más bajos salen primero.</span>
        </label>
      </div>

      <CampoImagen
        nombre="imagen"
        etiqueta="Diseño de la tarjeta (opcional)"
        actual={inicial?.foto_id ? `/fotos/${inicial.foto_id}?v=${inicial.version}` : undefined}
        permitirQuitar
      />
      <p className="-mt-3 text-sm text-neutral-500">Si no subes ninguna, se usa el diseño negro y dorado de Laksmir con el importe. Lo ideal es una imagen horizontal (3:2).</p>

      <label className="flex items-center gap-3 text-sm text-neutral-700">
        <input name="activo" type="checkbox" defaultChecked={activo} className="size-4 accent-neutral-900" />
        Visible en la tienda
      </label>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-4">
        <button type="submit" disabled={enviando} className="btn-primary">{enviando ? "Guardando…" : textoBoton}</button>
        <Link href="/admin/tienda" className="btn-secondary">Cancelar</Link>
      </div>
    </form>
  );
}
