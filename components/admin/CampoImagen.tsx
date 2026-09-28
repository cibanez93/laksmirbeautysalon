"use client";
// Campo para elegir una foto, con vista previa. Si ya hay una, se puede cambiar o quitar.
import { useState } from "react";

interface Props {
  nombre: string;
  etiqueta: string;
  actual?: string; // dirección de la foto actual (al editar)
  obligatorio?: boolean;
  permitirQuitar?: boolean; // muestra "Quitar la foto" (se envía como "quitar_<nombre>")
}

export default function CampoImagen({ nombre, etiqueta, actual, obligatorio = false, permitirQuitar = false }: Props) {
  const [vista, setVista] = useState<string | null>(actual ?? null);
  const [quitar, setQuitar] = useState(false);

  return (
    <div className="campo">
      <label htmlFor={`campo-${nombre}`}>{etiqueta}</label>
      <input
        id={`campo-${nombre}`}
        name={nombre}
        type="file"
        accept="image/*"
        required={obligatorio && !actual}
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          setVista(archivo ? URL.createObjectURL(archivo) : actual ?? null);
          setQuitar(false);
        }}
        className="input file:mr-4 file:border-0 file:bg-neutral-900 file:text-white file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wider"
      />
      {actual && <span className="normal-case tracking-normal text-neutral-400">Si no eliges ninguna, se queda la foto actual.</span>}
      {vista && !quitar && (
        // eslint-disable-next-line @next/next/no-img-element -- vista previa, no hace falta optimizar
        <img src={vista} alt="" className="mt-2 h-40 w-auto self-start object-cover border border-neutral-200" />
      )}
      {actual && permitirQuitar && (
        <label className="flex items-center gap-2 normal-case tracking-normal text-sm text-neutral-700 mt-1">
          <input type="checkbox" name={`quitar_${nombre}`} checked={quitar} onChange={(e) => setQuitar(e.target.checked)} className="accent-neutral-900" />
          Quitar la foto
        </label>
      )}
    </div>
  );
}
