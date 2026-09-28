"use client";
// Formulario compartido para crear y editar servicios
import Link from "next/link";
import { useActionState, useState } from "react";
import CampoImagen from "@/components/admin/CampoImagen";
import { reducirImagenes } from "@/components/admin/reducirImagen";
import type { EstadoFormulario } from "./actions";

interface Props {
  accion: (prev: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>;
  categorias: { id: number; nombre: string }[];
  inicial?: {
    categoria_id: number | null;
    foto_id: number | null;
    nombre: string;
    descripcion: string;
    duracion_min: number | null;
    precio: number | null;
    orden: number;
    activo: boolean;
    regalable: boolean;
  };
  version?: number; // para ver siempre la foto actual (evita la copia guardada del navegador)
  textoBoton: string;
}

type Campo = "categoria_id" | "nombre" | "descripcion" | "duracion_min" | "precio" | "orden";

export default function ServicioForm({ accion, categorias, inicial, version, textoBoton }: Props) {
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  // Antes de enviar, se reduce la foto (si se ha elegido una)
  const [estado, enviar, enviando] = useActionState(async (prev: EstadoFormulario, formData: FormData) => {
    setErrorLocal(null);
    if (!(await reducirImagenes(formData, ["imagen"]))) {
      setErrorLocal("No se ha podido leer la foto. Prueba con otra imagen (JPG o PNG).");
      return prev;
    }
    return accion(prev, formData);
  }, undefined);

  // Si la acción devolvió un error, rellenamos con lo que se había escrito
  const v = estado?.valores;
  const valor = (campo: Campo) => String(v ? v[campo] ?? "" : inicial?.[campo] ?? "");
  const activo = v ? v.activo === "on" : inicial?.activo ?? true;
  const regalable = v ? v.regalable === "on" : inicial?.regalable ?? false;
  const error = errorLocal ?? estado?.error;

  return (
    <form key={JSON.stringify(v)} action={enviar} className="flex flex-col gap-6 bg-white border border-neutral-200 p-6 md:p-8">
      <label className="campo">
        Nombre *
        <input name="nombre" required maxLength={100} defaultValue={valor("nombre")} className="input" />
      </label>

      <label className="campo">
        Descripción
        <textarea name="descripcion" rows={4} defaultValue={valor("descripcion")} className="input" />
      </label>

      <label className="campo">
        Categoría *
        <select name="categoria_id" required defaultValue={valor("categoria_id")} className="input">
          <option value="" disabled>Elige una categoría</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="campo">
          Duración (min)
          <input name="duracion_min" type="number" min={1} placeholder="Opcional" defaultValue={valor("duracion_min")} className="input" />
        </label>
        <label className="campo">
          Orden dentro de la categoría
          <input name="orden" type="number" defaultValue={valor("orden") || "0"} className="input" />
          <span className="normal-case tracking-normal text-neutral-400">Los números más bajos salen primero.</span>
        </label>
      </div>

      <CampoImagen
        nombre="imagen"
        etiqueta="Foto del servicio (se usa también en su bono regalo)"
        actual={inicial?.foto_id ? `/fotos/${inicial.foto_id}?v=${version ?? 0}` : undefined}
        permitirQuitar
      />

      {/* Tienda */}
      <fieldset className="border border-neutral-200 p-5 flex flex-col gap-4">
        <legend className="campo px-1">Tienda online</legend>
        <label className="flex items-center gap-3 text-sm text-neutral-700">
          <input name="regalable" type="checkbox" defaultChecked={regalable} className="size-4 accent-neutral-900" />
          Se puede comprar como bono regalo
        </label>
        <label className="campo">
          Precio del bono (€)
          <input name="precio" inputMode="decimal" placeholder="Por ejemplo: 45" defaultValue={valor("precio")} className="input sm:max-w-48" />
          <span className="normal-case tracking-normal text-neutral-400">Solo se ve en la tienda. En el resto de la web no se muestran precios.</span>
        </label>
      </fieldset>

      <label className="flex items-center gap-3 text-sm text-neutral-700">
        <input name="activo" type="checkbox" defaultChecked={activo} className="size-4 accent-neutral-900" />
        Visible en la web
      </label>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-4">
        <button type="submit" disabled={enviando} className="btn-primary">
          {enviando ? "Guardando…" : textoBoton}
        </button>
        <Link href="/admin" className="btn-secondary">Cancelar</Link>
      </div>
    </form>
  );
}
