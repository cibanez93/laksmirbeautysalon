// Gestión de sesiones del panel: crear, comprobar y cerrar.
import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { db } from "./db";

const COOKIE = "laksmir_session";
const DURACION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

const sha256 = (valor: string) => createHash("sha256").update(valor).digest("hex");

export async function createSession(usuarioId: number) {
  // Token aleatorio imposible de adivinar. El navegador guarda el token;
  // la base de datos guarda solo su hash.
  const token = randomBytes(32).toString("hex");
  const expiraEn = new Date(Date.now() + DURACION_MS);

  await db.execute(
    "INSERT INTO sesiones (token_hash, usuario_id, expira_en) VALUES (?, ?, ?)",
    [sha256(token), usuarioId, expiraEn]
  );

  (await cookies()).set(COOKIE, token, {
    httpOnly: true, // JavaScript del navegador no puede leerla
    secure: process.env.NODE_ENV === "production", // solo HTTPS en producción
    sameSite: "lax",
    path: "/",
    expires: expiraEn,
  });
}

// Devuelve el usuario conectado o null
export async function getSession(): Promise<{ usuarioId: number; email: string } | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT u.id, u.email
       FROM sesiones s
       JOIN usuarios u ON u.id = s.usuario_id
      WHERE s.token_hash = ? AND s.expira_en > NOW()`,
    [sha256(token)]
  );

  const fila = rows[0];
  return fila ? { usuarioId: fila.id, email: fila.email } : null;
}

// Úsala al principio de cada página y acción del panel.
// Si no hay sesión, manda al login.
export async function requireSession() {
  const sesion = await getSession();
  if (!sesion) redirect("/admin/login");
  return sesion;
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    await db.execute("DELETE FROM sesiones WHERE token_hash = ?", [sha256(token)]);
  }
  store.delete(COOKIE);
}
