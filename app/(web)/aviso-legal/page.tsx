// Aviso legal (Ley 34/2002, LSSI-CE, artículo 10): quién es la titular de la web.
// BORRADOR: faltan los datos de Carla (lib/legal.ts) y que lo revise su gestoría.
import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { Apartado } from "@/components/web/PaginaLegal";
import { titular } from "@/lib/legal";
import { salon } from "@/lib/salon";

export const metadata: Metadata = {
  title: "Aviso legal · Laksmir Beauty Salon",
  robots: { index: false },
};

export default function AvisoLegalPage() {
  return (
    <PaginaLegal titulo="Aviso legal">
      <Apartado titulo="Titular de la web">
        <p>En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), te informamos de quién está detrás de esta web:</p>
        <ul>
          <li><strong>Titular:</strong> {titular.nombre}</li>
          <li><strong>Nombre comercial:</strong> {salon.nombre}</li>
          <li><strong>NIF:</strong> {titular.nif}</li>
          <li><strong>Domicilio:</strong> {titular.domicilio}</li>
          <li><strong>Teléfono:</strong> {titular.telefono}</li>
          <li><strong>Email:</strong> {titular.email}</li>
          {titular.registro && <li><strong>Datos registrales:</strong> {titular.registro}</li>}
        </ul>
      </Apartado>

      <Apartado titulo="Para qué sirve esta web">
        <p>
          Esta web da a conocer los servicios de peluquería y estética de {salon.nombre}, permite reservar cita a través de Booksy, contactar por
          teléfono o WhatsApp y comprar tarjetas regalo, bonos y productos en la tienda online.
        </p>
      </Apartado>

      <Apartado titulo="Uso de la web">
        <p>
          Al navegar por la web te comprometes a usarla de forma correcta, sin dañarla ni utilizarla para fines ilegales. Los precios y
          servicios pueden cambiar; los que valen son los que te confirmemos al reservar o comprar.
        </p>
      </Apartado>

      <Apartado titulo="Propiedad intelectual">
        <p>
          Los textos, las fotos de nuestros trabajos, el logotipo y el diseño de esta web pertenecen a {salon.nombre} o se usan con permiso.
          No se pueden copiar ni reutilizar sin nuestra autorización. Las marcas de productos que se mencionan pertenecen a sus dueños.
        </p>
      </Apartado>

      <Apartado titulo="Enlaces a otras webs">
        <p>
          La web enlaza a servicios de otras empresas (Booksy, WhatsApp, Instagram y Google Maps). No somos responsables de su contenido ni de
          cómo tratan tus datos: te recomendamos leer sus propias condiciones.
        </p>
      </Apartado>

      <Apartado titulo="Privacidad y cookies">
        <p>
          Cómo tratamos tus datos está explicado en la <Link href="/privacidad">política de privacidad</Link>, y qué cookies usa la web, en la{" "}
          <Link href="/cookies">política de cookies</Link>.
        </p>
      </Apartado>

      <Apartado titulo="Legislación">
        <p>Este aviso legal se rige por la legislación española.</p>
      </Apartado>
    </PaginaLegal>
  );
}
