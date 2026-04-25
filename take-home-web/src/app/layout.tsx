import type { Metadata } from "next";
import "./globals.css";
import Provider from "./provider";
import { headers } from "next/headers";
import { UserProvider } from "@/contexts/user-context";
import type { User } from "@/contexts/user-context";

export const metadata: Metadata = {
  title: "Take Home",
};

// Lê os headers injetados pelo middleware (da resposta anterior)
async function getUserFromHeaders(): Promise<User | null> {
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

export default async function RootLayout(props: { children: React.ReactNode }) {
  // Executado no servidor a cada request - dados sempre frescos
  const initialUser = await getUserFromHeaders();
  const { children } = props;

  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <UserProvider initialUser={initialUser}>
          <Provider>{children}</Provider>
        </UserProvider>
      </body>
    </html>
  );
}
