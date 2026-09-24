import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  // Si ya ha iniciado sesión, directamente al panel
  if (await getSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-neutral-200 px-8 py-10">
        <Image src="/logo.png" alt="Laksmir Beauty Salon" width={800} height={243} className="w-auto h-14 mx-auto mb-8" priority />
        <h1 className="text-center text-sm uppercase tracking-widest text-neutral-500 mb-8">Panel de administración</h1>
        <LoginForm />
      </div>
    </main>
  );
}
