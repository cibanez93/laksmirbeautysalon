"use server";
// Acciones del panel para pedidos y bonos
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buscarBono, cambiarUsoBono, marcarEntregado } from "@/lib/pedidos";
import { requireSession } from "@/lib/session";
import { comprobarId } from "../utilidades";

export async function alternarEntregado(id: number, entregado: boolean) {
  await requireSession();
  await marcarEntregado(comprobarId(id), entregado === true);
  revalidatePath("/admin/pedidos");
}

// Canjear = marcar el bono como usado (o deshacerlo si fue un error)
export async function alternarUsoBono(id: number, usado: boolean) {
  await requireSession();
  await cambiarUsoBono(comprobarId(id), usado === true);
  revalidatePath("/admin/pedidos");
}

// Buscador de bonos por código: lleva a la misma página con el bono encontrado
export async function buscarCodigo(formData: FormData) {
  await requireSession();
  const codigo = String(formData.get("codigo") ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
  const bono = codigo ? await buscarBono(codigo) : null;
  redirect(`/admin/pedidos?codigo=${encodeURIComponent(codigo)}${bono ? "" : "&noexiste=1"}#bonos`);
}
