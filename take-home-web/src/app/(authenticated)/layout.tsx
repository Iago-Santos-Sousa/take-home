import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../../components/Navbar";
import { IUser } from "@/types/user";

async function getCurrentUser(): Promise<IUser | null> {
  const headerStore = await headers();
  const id = headerStore.get("x-user-id");
  if (!id) return null;

  return {
    id,
    name: headerStore.get("x-user-name") ?? "",
    email: headerStore.get("x-user-email") ?? "",
    role: (headerStore.get("x-user-role") as IUser["role"]) ?? "user",
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
    <div className="min-h-screen bg-sky-50">
      <Navbar userName={user.name} userRole={user.role} />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
