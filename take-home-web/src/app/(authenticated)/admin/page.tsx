import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const headerStore = await headers();
  const role = headerStore.get("x-user-role");
  if (role !== "admin") redirect("/dashboard");

  return <h1>Painel Administrativo</h1>;
}
