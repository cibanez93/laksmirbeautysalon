// /fotos/12/antes -> el "antes" de un antes/después
import { servirImagen } from "../../servir";

export async function GET(_request: Request, ctx: RouteContext<"/fotos/[id]/antes">) {
  return servirImagen((await ctx.params).id, "imagen_antes");
}
