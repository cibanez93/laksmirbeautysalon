# Laksmir Beauty Salon

Web para Laksmir Beauty Salon, una peluquería y centro de estética en Sarriguren (Navarra).

Es un proyecto real: la web la usa el salón para enseñar sus servicios y mandar a los clientes a reservar cita en Booksy. Además tiene un panel privado para que la dueña pueda añadir, cambiar u ocultar servicios sin tocar código.

## Qué hace

**Web pública**
- Portada, servicios, reservas y contacto.
- Los servicios salen de la base de datos, con precio y duración si los tienen.
- El botón de reservar lleva a la página del salón en Booksy.
- Datos estructurados (schema.org) para que Google entienda que es un salón de belleza.

**Panel de administración (`/admin`)**
- Login con email y contraseña.
- Crear, editar, ocultar/mostrar y borrar servicios.
- Los cambios se ven en la web al momento.

## Tecnologías

- Next.js 16 (App Router, Server Components y Server Actions)
- React 19 y TypeScript
- Tailwind CSS 4
- MySQL con la librería `mysql2`

## Algunas decisiones

**Por qué MySQL y no Supabase.** Al principio los servicios estaban en Supabase, pero en el plan gratuito el proyecto se pausa si pasa una semana sin uso y la web se quedaba sin servicios. Lo pasé a MySQL, que además quería practicar.

**Login hecho a mano, sin librería.** Para una sola usuaria no hacía falta nada más, y así entendía bien cómo funciona por dentro:
- Las contraseñas se guardan con `scrypt` (viene con Node) y una sal aleatoria, nunca en texto plano.
- Al entrar se crea un token aleatorio. El navegador lo guarda en una cookie `httpOnly` y en la base de datos se guarda solo su hash, así que aunque alguien leyera la tabla no podría usar las sesiones.
- Cada página y cada acción del panel comprueba la sesión en el servidor, no solo en la interfaz.

**Consultas con parámetros.** Todas las consultas usan `?` en lugar de meter los valores en el texto del SQL, para evitar inyección SQL.

**Usuario de MySQL con permisos mínimos.** La web se conecta con un usuario que solo puede leer y escribir en su base de datos, no crear ni borrar tablas.

## Estructura

```
app/
  page.tsx              web pública
  admin/                panel de administración
    actions.ts          lo que pasa al enviar cada formulario
    login/              pantalla de login
    servicios/          crear y editar servicios
lib/
  db.ts                 conexión a MySQL
  servicios.ts          consultas de la tabla servicios
  session.ts            crear, comprobar y cerrar sesiones
  password.ts           cifrado de contraseñas
database/
  schema.sql            tablas de la base de datos
scripts/
  crear-admin.ts        crea el usuario del panel
```

## Cómo arrancarlo en local

Necesitas Node 22.18 o superior y MySQL.

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Crea la base de datos y las tablas:
   ```bash
   mysql -u root < database/schema.sql
   ```

3. Crea un usuario de MySQL para la web:
   ```sql
   CREATE USER 'laksmir_app'@'localhost' IDENTIFIED BY 'una-contraseña';
   GRANT SELECT, INSERT, UPDATE, DELETE ON laksmir.* TO 'laksmir_app'@'localhost';
   ```

4. Crea un archivo `.env.local` con los datos de conexión:
   ```
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=laksmir_app
   DB_PASSWORD=una-contraseña
   DB_NAME=laksmir
   ```
   Si la base de datos está en la nube y pide conexión cifrada, añade `DB_SSL=true`.

5. Crea tu usuario para el panel (te pide email y contraseña):
   ```bash
   npm run crear-admin
   ```

6. Arranca la web:
   ```bash
   npm run dev
   ```
   La web queda en http://localhost:3000 y el panel en http://localhost:3000/admin

## Pendiente

- Publicar la web y pasar la base de datos a un MySQL en la nube.
- Subir fotos de los servicios desde el panel.
- Limitar los intentos de login para evitar ataques de fuerza bruta.
