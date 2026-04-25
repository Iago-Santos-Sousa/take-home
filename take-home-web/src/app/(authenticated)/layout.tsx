import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

async function getCurrentUser(): Promise<User | null> {
  const headerStore = await headers();

  const id = headerStore.get("x-user-id");
  if (!id) return null; // Middleware não injetou → não autenticado

  return {
    id,
    name: headerStore.get("x-user-name") ?? "",
    email: headerStore.get("x-user-email") ?? "",
    role: (headerStore.get("x-user-role") as User["role"]) ?? "user",
  };
}

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div>
      <nav>
        <span>Olá, {user.name}</span>
        {user.role === "admin" && <a href="/admin">Painel Admin</a>}
      </nav>
      <main>{children}</main>
    </div>
  );
}
