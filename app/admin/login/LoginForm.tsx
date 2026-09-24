"use client";
import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  // useActionState nos da el error que devuelve la acción y si está enviando
  const [estado, accion, enviando] = useActionState(login, undefined);

  return (
    <form action={accion} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-xs uppercase tracking-wide text-neutral-500">
        Email
        <input name="email" type="email" defaultValue={estado?.valores?.email} autoComplete="username" required className="input" />
      </label>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-wide text-neutral-500">
        Contraseña
        <input name="password" type="password" autoComplete="current-password" required className="input" />
      </label>

      {estado?.error && (
        <p role="alert" className="text-sm text-red-700">{estado.error}</p>
      )}

      <button type="submit" disabled={enviando} className="btn-primary mt-2">
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
