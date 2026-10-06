// Política de privacidad (RGPD y LOPDGDD): qué datos se recogen, para qué y qué derechos tienes.
// BORRADOR: faltan los datos de Carla (lib/legal.ts) y que lo revise su gestoría.
// Si se activa el asistente con IA (Claude) o un email de confirmación (Resend), hay que añadirlos en «Quién más ve tus datos».
import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { Apartado } from "@/components/web/PaginaLegal";
import { titular } from "@/lib/legal";
import { salon } from "@/lib/salon";
import { MESES_CADUCIDAD } from "@/lib/tienda";

export const metadata: Metadata = {
  title: "Política de privacidad · Laksmir Beauty Salon",
  robots: { index: false },
};

export default function PrivacidadPage() {
  return (
    <PaginaLegal titulo="Política de privacidad">
      <p>
        En {salon.nombre} cuidamos tus datos igual que cuidamos de ti en el salón. Aquí te explicamos, de forma clara, qué datos recogemos,
        para qué y qué puedes hacer con ellos.
      </p>

      <Apartado titulo="Quién es la responsable de tus datos">
        <ul>
          <li><strong>Responsable:</strong> {titular.nombre} ({salon.nombre})</li>
          <li><strong>NIF:</strong> {titular.nif}</li>
          <li><strong>Dirección:</strong> {titular.domicilio}</li>
          <li><strong>Email:</strong> {titular.email}</li>
        </ul>
      </Apartado>

      <Apartado titulo="Qué datos recogemos y para qué">
        <p><strong>Compras en la tienda online.</strong> Cuando compras una tarjeta regalo, un bono o un producto, te pedimos nombre, email, teléfono y, si eliges envío, la dirección. Los usamos para preparar tu pedido, enviarte el bono y emitir la factura.</p>
        <p><strong>Pagos.</strong> El pago lo gestiona Stripe. Nosotras nunca vemos ni guardamos los datos de tu tarjeta.</p>
        <p><strong>Contacto.</strong> Si nos llamas o nos escribes por WhatsApp, usamos tu nombre y tu teléfono solo para responderte.</p>
        <p><strong>Reservas.</strong> Las citas se reservan en Booksy, que trata tus datos según su propia política de privacidad.</p>
        <p><strong>Asistente de la web.</strong> Las preguntas que escribes en el asistente no se guardan: solo se usan para darte la respuesta en ese momento.</p>
        <p>No usamos tus datos para enviarte publicidad sin tu permiso ni los vendemos a nadie.</p>
      </Apartado>

      <Apartado titulo="Por qué podemos usarlos (base legal)">
        <ul>
          <li><strong>Pedidos de la tienda:</strong> para cumplir el contrato de compra (artículo 6.1.b del RGPD).</li>
          <li><strong>Facturas:</strong> porque la ley nos obliga a guardarlas (artículo 6.1.c del RGPD).</li>
          <li><strong>Responder a tus mensajes:</strong> porque tú nos los has enviado (artículo 6.1.a y 6.1.b del RGPD).</li>
        </ul>
      </Apartado>

      <Apartado titulo="Cuánto tiempo los guardamos">
        <p>
          Los datos de los pedidos, mientras el bono o la tarjeta regalo sea válido ({MESES_CADUCIDAD} meses) y, después, el tiempo que obliga
          la ley para las facturas y la contabilidad (normalmente 6 años). Los mensajes de contacto, el tiempo necesario para atenderte.
        </p>
      </Apartado>

      <Apartado titulo="Quién más ve tus datos">
        <p>Solo las empresas que necesitamos para que la web funcione, que tratan los datos siguiendo nuestras instrucciones:</p>
        <ul>
          <li><strong>Vercel</strong>: aloja la web.</li>
          <li><strong>TiDB Cloud (PingCAP)</strong>: guarda la base de datos en servidores de la Unión Europea (Fráncfort).</li>
          <li><strong>Stripe</strong>: procesa los pagos.</li>
        </ul>
        <p>
          Algunas de estas empresas son de Estados Unidos. En ese caso, la transferencia de datos está protegida por el Marco de Privacidad de
          Datos UE-EE. UU. o por las cláusulas contractuales tipo de la Comisión Europea.
        </p>
      </Apartado>

      <Apartado titulo="Tus derechos">
        <p>
          Puedes pedirnos en cualquier momento ver tus datos, corregirlos, borrarlos, limitar su uso, oponerte a que los usemos o llevártelos a
          otra empresa. Escríbenos a {titular.email} o pásate por el salón.
        </p>
        <p>
          Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos (
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).
        </p>
      </Apartado>

      <Apartado titulo="Cookies">
        <p>Lo explicamos en la <Link href="/cookies">política de cookies</Link>.</p>
      </Apartado>
    </PaginaLegal>
  );
}
