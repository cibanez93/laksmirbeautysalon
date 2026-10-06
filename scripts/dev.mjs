// Arranca la web en tu ordenador (npm run dev) con las variables de .env.desarrollo.
// No usamos .env.local a propósito: el adaptador de Cloudflare mete esos archivos en la web publicada.
import { spawn } from "node:child_process";

process.loadEnvFile(".env.desarrollo");

const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});
next.on("exit", (codigo) => process.exit(codigo ?? 0));
for (const senal of ["SIGINT", "SIGTERM"]) process.on(senal, () => next.kill(senal));
