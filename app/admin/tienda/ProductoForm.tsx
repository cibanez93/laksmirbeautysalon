"use client";
// Formulario para crear y editar productos de la tienda
import Link from "next/link";
import { useActionState, useState } from "react";
import CampoImagen from "@/components/admin/CampoImagen";
import { reducirImagenes } from "@/components/admin/reducirImagen";
import type { EstadoFormulario } from "../actions";

interface Props {
  accion: (prev: EstadoFormulario, formData: FormData) => Promise<EstadoFormulario>;
  marcas: string[];
  inicial?: { nombre: string; marca: string; descripcion: string; precio: number; stock: number; orden: number; activo: boolean; foto_id: number | null; version: number };
  textoBoton: string;
}

type Campo = "nombre" | "marca" | "descripcion" | "precio" | "stock" | "orden";

export default function ProductoForm({ accion, marcas, inicial, textoBoton }: Props) {
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
      <div className="grid sm:grid-cols-2 gap-6">
        <label className="campo">
          Nombre *
          <input name="nombre" required maxLength={120} placeholder="Por ejemplo: Champú reparador" defaultValue={valor("nombre")} className="input" />
        </label>
        <label className="campo">
          Marca
          <input name="marca" maxLength={80} list="marcas" defaultValue={valor("marca")} className="input" />
          <datalist id="marcas">{marcas.map((m) => <option key={m} value={m} />)}</datalist>
        </label>
      </div>

      <label className="campo">
        Descripción *
        <textarea name="descripcion" required rows={4} defaultValue={valor("descripcion")} className="input" />
      </label>

      <div className="grid grid-cols-3 gap-6">
        <label className="campo">
          Precio (€) *
          <input name="precio" required inputMode="decimal" placeholder="18,50" defaultValue={valor("precio")} className="input" />
        </label>
        <label className="campo">
          Stock *
          <input name="stock" required type="number" min={0} defaultValue={valor("stock") || "0"} className="input" />
          <span className="normal-case tracking-normal text-neutral-400">0 = agotado</span>
        </label>
        <label className="campo">
          Orden
          <input name="orden" type="number" defaultValue={valor("orden") || "0"} className="input" />
        </label>
      </div>

      <CampoImagen
        nombre="imagen"
        etiqueta="Foto del producto"
        actual={inicial?.foto_id ? `/fotos/${inicial.foto_id}?v=${inicial.version}` : undefined}
        permitirQuitar
      />

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
