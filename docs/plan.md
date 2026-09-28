# Plan de la web de Laksmir Beauty Salon

Documento de trabajo: qué vamos a hacer y cómo. Se actualiza a medida que avanzamos.

## 1. Objetivo

**Para qué sirve la web**
- Conseguir reservas (la acción principal es **reservar en Booksy**).
- Mostrar todos los servicios con sus precios.
- Enseñar los trabajos del salón.
- Dar confianza a quien no nos conoce.
- Tener algo innovador que no tengan las webs de otros centros de estética.

**A quién va dirigida**
- Clientas de la zona (Ripagaina, Pamplona y alrededores).
- Novias y eventos.
- Personas que buscan tratamientos estéticos.
- Todo el público: mujeres, hombres y niños.

**Meta de SEO**
Aparecer entre los primeros resultados de Google al buscar peluquerías y centros de estética en Pamplona y Navarra.

**Datos del salón**
- Dirección: Calle la Valeta 1, 31621 Ripagaina (Navarra)
- Teléfono y WhatsApp: 948 04 21 90
- Instagram: @laksmirbeauty
- Abierto desde 2020
- Marcas: Wella Professionals, SP System Professional, Casmara, Kinetics y Tanino Therapy
- El nombre: "Laksmir" es una palabra creada por la fundadora, inspirada en Lakshmi, la diosa de la belleza y la abundancia en la India, modificando un poco el nombre para darle personalidad propia.
- Horario: lunes de 13:00 a 20:00 · martes a viernes de 10:00 a 20:00 · sábados de 9:00 a 13:00 · domingos cerrado

## 2. Páginas y secciones

La web tendrá **varias páginas** separadas (hay muchos servicios y es mejor para Google).

**Páginas principales**
| Página | Contenido |
|---|---|
| Inicio | Presentación del salón y acceso rápido a reservar. |
| Servicios | Todos los servicios por secciones de categoría, con duración y botón de reservar, y un buscador. **Sin precios** (decisión: queda más elegante; los precios se ven en Booksy o preguntando a la asistente). |
| Una página por categoría | Peluquería, Tratamientos faciales, Corporales, Manicura, Maquillaje, Masajes, Diseño de mirada. |
| Novias | Página propia para bodas y eventos. |
| Galería / Trabajos | Fotos de los trabajos del salón. |
| Sobre nosotras / Equipo | Historia del salón y las profesionales. |
| Blog / Consejos | Artículos sobre cuidado del pelo y la piel. |
| Contacto | Mapa, dirección, horario, teléfono. |

**Páginas internas**
| Página | Contenido |
|---|---|
| Panel de administración | Gestión de servicios (ya existe en `/admin`). |
| Mantenimiento | Aviso temporal mientras se publica la web (ya existe). |

_Pendiente: detallar las secciones de cada página._

## 3. Diseño

**Estilo:** cálido y cercano, con toques elegantes de la marca.

**Sin precios en la web.** Decisión: no se muestra el precio de ningún servicio en ninguna página (queda más elegante). Los precios se consultan en Booksy.

**Principio clave: muy intuitiva.** Cualquier persona, también desde el móvil, tiene que encontrar en segundos cómo reservar, qué servicios hay y cuánto cuestan. El botón de reservar siempre visible.

**Colores:** los del logo, negro y dorado, sobre fondos cálidos para que no quede frío.
| Uso | Color |
|---|---|
| Texto y botones principales | Negro |
| Detalles, líneas y adornos | Dorado del logo |
| Fondos | Blanco roto y beige claro (crema) |

**Símbolo:** la flor de loto de Lakshmi, dibujada en dorado fino, de fondo en la sección del nombre (página Nosotras). El adorno de los títulos es línea, rombo, línea, como en el logo.

**Tipografías** (ya instaladas en el proyecto)
- **Brand**: la del logo, para el nombre "Laksmir".
- **Abhaya Libre**: con serifa, para títulos.
- **Montserrat**: para textos y botones.

**Fotos:** todavía no hay. Usaremos imágenes de ejemplo y se cambiarán por fotos reales del salón cuando estén hechas.

**Referencias:** no hay ninguna web de referencia. Antes de programar se hará una maqueta visual para decidir el aspecto.

## 4. Funcionalidades

**Lo que ya funciona**
- Las opiniones de Booksy de la portada se actualizan solas una vez al día. Las de Google se cambian a mano en `lib/salon.ts` (se pueden automatizar con la API de Google Places, que pide tarjeta).
- Servicios cargados desde la base de datos (MySQL).
- Panel de administración con login para crear, editar, ocultar y borrar servicios.
- Botón de reservar que lleva a Booksy.
- Modo mantenimiento.

**Funcionalidades innovadoras** (lo que no tienen otros centros)
- **Asistente con inteligencia artificial**: un chat en la web donde la clienta pregunta por servicios y precios, y la asistente le recomienda tratamientos y la lleva a reservar en Booksy. Está en dos sitios: un botón flotante "¿Te ayudo?" visible en todas las páginas y una sección propia en la portada con el chat abierto y preguntas sugeridas para tocar (por ejemplo "¿Cuánto cuesta un corte?"). Sustituye al test de "¿qué tratamiento necesito?".
  - Solo habla de temas del salón y usa los servicios y precios reales de la base de datos (no se inventa nada).
  - Siempre termina invitando a reservar en Booksy.
  - ✅ El chat funciona (ventanita desde el botón flotante y sección en la portada, con la misma conversación).
  - ✅ Conectado a Claude (Anthropic), modelo Claude Opus 5 con esfuerzo bajo (`lib/asistente/`). Conoce los servicios reales de la base de datos, el equipo, el horario y los packs de novia. Responde con texto y hasta 3 botones de una lista cerrada.
  - Decisión: de momento **sin IA de pago**. Responde con respuestas preparadas (`lib/respuestas-asistente.ts`): unos 35 temas, elige el que más coincide, entiende preguntas de seguimiento ("¿y cuánto dura?") y nunca da precios. La IA queda preparada pero apagada hasta que el salón decida pagarla.
  - Seguridad: la clave solo está en el servidor (`ANTHROPIC_API_KEY`), máximo 30 preguntas por persona y hora, mensajes de 600 letras como máximo.
  - ⬜ (Opcional, si el salón quiere pagar) Crear la cuenta de Anthropic, la clave y poner un límite de gasto mensual.
  - No da precios: si preguntan, remite a Booksy.
  - Tiene un coste por uso (unos céntimos por conversación con un modelo pequeño): habrá que poner un límite de gasto.
- **Antes / después deslizable** ✅ ya funciona: fotos con una barra que se arrastra (o se mueve con las flechas del teclado) para ver el cambio. Está en la portada y en la galería.
- **Packs de novia** (sustituye a la calculadora de presupuesto, porque la web no muestra precios): tres packs cerrados (Esencial, Completo, Premium). La novia elige uno, pone su nombre y la fecha, y se abre WhatsApp con el mensaje ya escrito.
- **Tarjeta regalo**: regalar un servicio a otra persona. Se gestiona con **Booksy**: la web explica la tarjeta regalo y enlaza a Booksy para comprarla.

**Gestión del contenido**
| Contenido | Quién lo gestiona | Cómo |
|---|---|---|
| Servicios | Mi hermana | Panel de administración: crear, editar, ocultar y borrar, con categoría (sin precios). ✅ |
| Galería | Mi hermana | Panel de administración: subir fotos y antes/después, editar (título, categoría, forma e imagen), ocultar y borrar. Se reducen solas antes de subirlas. ✅ |
| Fotos destacadas | Mi hermana | Panel → Destacados: qué foto se ve en la portada, en los 3 servicios destacados (y qué servicio), en el equipo, en cada categoría y en novias. ✅ |
| Blog | Yo | Mi hermana escribe los artículos y yo los publico desde el panel: borrador o publicado, editar y borrar. ✅ |

## 5. Datos

Qué se guarda en la base de datos (MySQL):

| Tabla | Para qué | Estado |
|---|---|---|
| `servicios` | Los servicios del salón | Existe (68 servicios de Booksy) |
| `usuarios` | Quién puede entrar al panel | Existe |
| `sesiones` | Sesiones abiertas del panel | Existe |
| `categorias` | Peluquería, Faciales, Manicura... Cada servicio apunta a su categoría (clave foránea) | ✅ Hecha |
| `fotos` | Fotos de la galería. Las imágenes se guardan dentro de la base de datos (reducidas a ~300 KB) | ✅ Hecha |

| `destacados` | Qué foto de la galería se ve en cada sitio de la web (y qué servicio en los destacados de la portada) | ✅ Hecha |
| `articulos` | Artículos del blog: título, resumen, contenido, tema (Cabello, Piel, Uñas, Novias), autora, fecha, publicado o borrador | ✅ Hecha |

## 6. Fases

Decisión: **diseñar todas las páginas primero y publicar al final**. Mientras tanto, la web real sigue en modo mantenimiento (con el enlace a Booksy para reservar).

1. ✅ **Maqueta visual**: aspecto general aprobado (colores, tipografías, estilo).
2. **Diseño de páginas** (solo visual, con datos e imágenes de ejemplo):
   - ✅ Base común: cabecera, pie, botón de la asistente y colores de la marca
   - ✅ Inicio
   - ✅ Servicios (sin precios, por secciones, lista elegante y buscador)
   - ✅ Páginas de categoría (portada, servicios, quién te atiende, preguntas frecuentes, otras categorías)
   - ✅ Novias (packs cerrados sin precio, pedir información por WhatsApp, calendario, invitadas, galería, preguntas)
   - ✅ Galería (antes/después deslizables arriba, fotos mezcladas debajo; de momento con fotos de ejemplo)
   - ✅ Nosotras (historia desde 2020, el nombre Laksmir, valores, equipo en detalle, el salón y las marcas)
   - ✅ Contacto (reservar, llamar, WhatsApp, Instagram, "abierto ahora", dirección, horario y mapa de Google que se carga al pulsar)
   - ✅ Blog (lista estilo revista con filtro por tema, página de artículo; de momento con artículos de ejemplo)
3. ✅ **Funcionamiento**: categorías en la base de datos, galería con subida de fotos, blog en el panel de administración, asistente (respuestas preparadas).
4. **SEO**: títulos, descripciones, datos estructurados, mapa del sitio, alta en Google Search Console.
5. **Publicación**: base de datos en TiDB, web en Netlify, dominio y quitar el mantenimiento.
6. **Contenido real**: fotos del salón y primeros artículos del blog.

## 8. Tienda online

**Qué se vende**
- **Bonos regalo de servicios**: se compra un servicio concreto para regalar (por ejemplo, una limpieza facial). Quien lo recibe reserva la cita presentando el código. **Caducan al año.** Mismo precio que en Booksy.
- **Tarjetas regalo por importe**: 30, 50, 100 €... para gastar en el salón. Caducan al año.
- **Productos físicos**: champús, mascarillas, esmaltes... **Recogida en el salón o envío a casa.**

**Cómo**: tienda propia dentro de la web, con pago por **Stripe** (Stripe Checkout: la página de pago la pone Stripe, así los datos de la tarjeta nunca pasan por nuestro servidor).

**Excepción a "sin precios"**: en la tienda sí se ven precios, porque es obligatorio para vender.

**Qué hace falta del salón (no se puede hacer desde el código)**
- Cuenta de Stripe a nombre del negocio (la crea Carla) y sus claves.
- Textos legales revisados por la gestoría: aviso legal, privacidad, condiciones de venta, devoluciones (14 días de desistimiento) y cookies.
- Lista de productos con foto, precio y stock.
- Gastos de envío (precio y a partir de cuánto es gratis) y con qué transportista.
- Cómo se canjean los bonos en el salón.
- Servicio de emails para enviar los bonos (por ejemplo Resend, gratis hasta 3.000 al mes).

**Fases**
1. ✅ Diseño de la tienda (visual, con datos de ejemplo): página de tienda (tarjetas regalo, bonos con filtro por categoría, productos), carrito guardado en el navegador, mensaje para el regalo, recogida o envío. Los bonos usan los precios de Booksy y solo salen servicios de 15 € o más.
2. Base de datos:
   - ✅ Tarjetas regalo gestionadas desde el panel (sección Tienda): nombre, importe, diseño propio (foto) u opcionalmente el diseño negro y dorado, orden y visible.
   - ✅ Productos gestionados desde el panel (sección Tienda): foto, marca, descripción, precio, stock y visible. Con stock 0 salen como agotados.
   - ✅ Cada servicio puede tener foto (sale en su lista y en su bono), precio para la tienda y la casilla «Se puede regalar».
   - ⬜ Pedidos y bonos vendidos (con código único).
3. Pago con Stripe en modo de pruebas (tarjetas de prueba, sin dinero real).
4. Después del pago: confirmación, email con el bono y aviso al salón.
5. Panel: productos y stock, pedidos, y canjear bonos (marcar como usado).
6. Páginas legales y pasar Stripe a modo real.

## Pendiente de revisar con Carla

- Textos de presentación y respuestas de las preguntas frecuentes de cada categoría (`lib/categorias.ts`).
- Quién hace maquillaje, masajes, depilación y diseño de mirada (`lib/equipo.ts`).
- Nombres de servicios con erratas o sin tildes (se corrigen en la base de datos).
- Contenido de los packs de novia, el calendario y las preguntas de novias (`lib/novias.ts`).
- Historia del salón y valores (`app/(web)/nosotras/page.tsx`).
- Historias de Carla, Helen y Erika: son un borrador sin datos concretos; cada una tiene que leer la suya y añadir su formación o años de experiencia si quiere (`lib/equipo.ts`).

## 7. Ideas para más adelante

- Reclamar la ficha de Google Business del salón (lo que más ayuda al SEO local).
- Recuperar o redirigir los dominios antiguos (`laksmirbeauty.com`, `laksmirnailstudio.com`).
- Limitar los intentos de login del panel.
- Páginas propias por tema del blog (/blog/cabello...) cuando haya suficientes artículos (bueno para el SEO).
- Conectar la asistente al WhatsApp del salón (WhatsApp Business Platform de Meta) para responder mensajes automáticamente.
- Crear mi portfolio personal (proyecto aparte) con esta web como proyecto principal, y cambiar el enlace "Diseño y desarrollo web" del pie para que apunte al portfolio en lugar de a GitHub.
