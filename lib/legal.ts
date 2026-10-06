// Datos de la titular de la web para las páginas legales (aviso legal, privacidad y cookies).
// PENDIENTE: rellenar con Carla y que su gestoría revise los textos antes de quitar el mantenimiento.
import { salon } from "./salon";

export const titular = {
  nombre: "[PENDIENTE: nombre completo de Carla o nombre de la empresa]",
  nif: "[PENDIENTE: NIF]",
  // Solo si es una sociedad (S.L.): datos del Registro Mercantil. Si es autónoma, se deja vacío.
  registro: "",
  email: "[PENDIENTE: email de contacto]",
  telefono: salon.telefono,
  domicilio: `${salon.direccion.calle}, ${salon.direccion.cp} ${salon.direccion.localidad} (${salon.direccion.provincia})`,
};

export const actualizado = "octubre de 2026";

export const paginasLegales = [
  { texto: "Aviso legal", href: "/aviso-legal" },
  { texto: "Privacidad", href: "/privacidad" },
  { texto: "Cookies", href: "/cookies" },
];
