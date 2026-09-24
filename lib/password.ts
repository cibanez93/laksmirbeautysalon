// Cifrado de contraseñas con scrypt (viene incluido en Node, no hace falta instalar nada).
// Guardamos "sal:hash". La sal es aleatoria para que dos contraseñas iguales
// no produzcan el mismo hash.
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (password: string, salt: string, keylen: number) => Promise<Buffer>;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = await scryptAsync(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const hash = await scryptAsync(password, salt, 64);
  const storedHash = Buffer.from(hashHex, "hex");
  // timingSafeEqual compara sin dar pistas por el tiempo que tarda
  return storedHash.length === hash.length && timingSafeEqual(storedHash, hash);
}
