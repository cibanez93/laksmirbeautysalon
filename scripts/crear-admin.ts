// Crea (o cambia la contraseña de) un usuario del panel.
// Uso:  npm run crear-admin
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Writable } from "node:stream";
import mysql from "mysql2/promise";
import { hashPassword } from "../lib/password.ts";

// Lo que readline escribe en pantalla pasa por aquí. Mientras se escribe la contraseña
// lo silenciamos, para que no se vea lo que se teclea.
let silencio = false;
const pantalla = new Writable({
  write(trozo, codificacion, listo) {
    if (!silencio) stdout.write(trozo, codificacion);
    listo();
  },
});
const rl = createInterface({ input: stdin, output: pantalla, terminal: true });

// Pregunta ocultando lo que se escribe (para la contraseña)
async function preguntarOculto(texto: string): Promise<string> {
  stdout.write(texto);
  silencio = true;
  const respuesta = await rl.question("");
  silencio = false;
  stdout.write("\n");
  return respuesta;
}

const email = (await rl.question("Email del administrador: ")).trim().toLowerCase();
const password = await preguntarOculto("Contraseña (mínimo 10 caracteres): ");
const repetida = await preguntarOculto("Repite la contraseña: ");
rl.close();

if (!email.includes("@")) throw new Error("Email no válido.");
if (password.length < 10) throw new Error("La contraseña debe tener al menos 10 caracteres.");
if (password !== repetida) throw new Error("Las contraseñas no coinciden.");

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
});

// Si el email ya existe, actualiza la contraseña y cierra sus sesiones abiertas
await db.execute(
  `INSERT INTO usuarios (email, password_hash) VALUES (?, ?)
   ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
  [email, await hashPassword(password)]
);
await db.execute(
  "DELETE s FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id WHERE u.email = ?",
  [email]
);
await db.end();

console.log(`Listo. Ya puedes entrar en /admin/login con ${email}`);
