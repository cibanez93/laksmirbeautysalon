"use server";
// Acciones del panel para los productos de la tienda
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as fotos from "@/lib/fotos";
import * as productos from "@/lib/productos";
import { requireSession } from "@/lib/session";
import type { EstadoFormulario } from "../actions";
import { comprobarId, leerImagenOpcional, valoresDe } from "../utilidades";

function leerFormulario(formData: FormData): productos.DatosProducto | string {
  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();
  const nombre = texto("nombre");
  const marca = texto("marca");
  const descripcion = texto("descripcion");
  const precio = Number(texto("precio").replace(",", "."));
  const stock = Number(texto("stock") || "0");
  const orden = Number(texto("orden") || "0");

  if (!nombre) return "El nombre es obligatorio.";
  if (nombre.length > 120) return "El nombre no puede tener más de 120 caracteres.";
  if (marca.length > 80) return "La marca no puede tener más de 80 caracteres.";
  if (!descripcion) return "La descripción es obligatoria.";
  if (!Number.isFinite(precio) || precio <= 0 || precio > 99999) return "Escribe un precio válido (por ejemplo, 18,50).";
  if (!Number.isInteger(stock) || stock < 0) return "El stock tiene que ser un número entero (0 = agotado).";
  if (!Number.isInteger(orden)) return "El orden debe ser un número entero.";

  return { nombre, marca, descripcion, precio, stock, orden, activo: formData.get("activo") === "on" };
}

export async function crearProducto(_prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };
  const imagen = await leerImagenOpcional(formData.get("imagen"));
  if (typeof imagen === "string") return { error: imagen, valores: valoresDe(formData) };

  const id = await productos.crearProducto(datos);
  if (imagen) await productos.cambiarFotoProducto(id, await fotos.crearImagenInterna(datos.nombre, "producto", imagen));
  revalidatePath("/", "layout");
  redirect("/admin/tienda");
}

export async function editarProducto(id: number, _prev: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  await requireSession();
  const datos = leerFormulario(formData);
  if (typeof datos === "string") return { error: datos, valores: valoresDe(formData) };

  const producto = await productos.obtenerProducto(comprobarId(id));
  if (!producto) return { error: "Este producto ya no existe." };

  // Foto: nueva, quitarla o dejar la que había
  const imagen = await leerImagenOpcional(formData.get("imagen"));
  if (typeof imagen === "string") return { error: imagen, valores: valoresDe(formData) };
  if (imagen || formData.get("quitar_imagen") === "on") {
    await productos.cambiarFotoProducto(id, imagen ? await fotos.crearImagenInterna(datos.nombre, "producto", imagen) : null);
    if (producto.foto_id) await fotos.borrarImagenInterna(producto.foto_id);
  }

  await productos.actualizarProducto(id, datos);
  revalidatePath("/", "layout");
  redirect("/admin/tienda");
}

export async function alternarActivoProducto(id: number, activo: boolean) {
  await requireSession();
  await productos.cambiarActivoProducto(comprobarId(id), activo === true);
  revalidatePath("/", "layout");
}

export async function borrarProducto(id: number) {
  await requireSession();
  const producto = await productos.obtenerProducto(comprobarId(id));
  await productos.borrarProducto(id);
  if (producto?.foto_id) await fotos.borrarImagenInterna(producto.foto_id);
  revalidatePath("/", "layout");
}
