import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

async function getCurrentUser(): Promise<User | null> {
  const headerStore = await headers();
  const id = headerStore.get("x-user-id");
  if (!id) return null;

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
    <div style={{ minHeight: "100vh", background: "#f0f4ff" }}>
      <Navbar userName={user.name} userRole={user.role} />
      <main
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}
      >
        {children}
      </main>
    </div>
  );
}
