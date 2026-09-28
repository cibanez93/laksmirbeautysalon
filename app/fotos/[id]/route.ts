// /fotos/12 -> la foto (o el "después" de un antes/después)
import { servirImagen } from "../servir";

export async function GET(_request: Request, ctx: RouteContext<"/fotos/[id]">) {
  return servirImagen((await ctx.params).id, "imagen");
}
