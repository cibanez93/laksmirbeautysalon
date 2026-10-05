// Diseño común de las páginas públicas: cabecera, pie y botón de la asistente.
// El panel (/admin) y la página de mantenimiento quedan fuera de este grupo.
import AvisoVistaPrevia from "@/components/web/AvisoVistaPrevia";
import BotonAsistente from "@/components/web/BotonAsistente";
import { ChatProveedor } from "@/components/web/chat/ChatContexto";
import Cabecera from "@/components/web/Cabecera";
import Pie from "@/components/web/Pie";
import { CarritoProveedor } from "@/components/tienda/CarritoContexto";

export default function WebLayout({ children }: LayoutProps<"/">) {
  return (
    <CarritoProveedor>
      <ChatProveedor>
        <div className="min-h-screen flex flex-col bg-crema text-neutral-900">
          <AvisoVistaPrevia />
          <Cabecera />
          <main className="flex-1">{children}</main>
          <Pie />
          <BotonAsistente />
        </div>
      </ChatProveedor>
    </CarritoProveedor>
  );
}
