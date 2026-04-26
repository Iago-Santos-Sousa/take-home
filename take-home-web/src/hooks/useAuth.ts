"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/integration/api";
import { useUser } from "@/contexts/user-context";
import { toaster } from "@/components/ui/toaster";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

interface ILoginInput {
  email: string;
  password: string;
}

interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

export function useLogin() {
  const { setUser } = useUser();

  const { mutateAsync: handleLogin, isPending: isLoggingIn } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: ILoginInput) => {
      const response = await api.post<{
        message: string;
        user: { sub: number; username: string; email: string; roles: string[] };
      }>("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      const { user } = data;
      setUser({
        id: String(user.sub),
        name: user.username,
        email: user.email,
        role: (user.roles[0] as "admin" | "user") ?? "user",
      });
      // Navegação completa para que o middleware seja executado do zero com o novo cookie.
      window.location.href = "/exams";
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error, "Credenciais inválidas");
      toaster.create({ title: message, type: "error" });
    },
  });

  return {
    handleLogin,
    isLoggingIn,
  };
}

export function useRegister() {
  const router = useRouter();

  const { mutateAsync: handleRegister, isPending: isRegistering } = useMutation(
    {
      mutationKey: ["register"],
      mutationFn: async (data: IRegisterInput) => {
        const response = await api.post("/user", data);
        return response.data;
      },
      onSuccess: () => {
        toaster.create({
          title: "Conta criada com sucesso! Faça login para continuar.",
          type: "success",
        });
        router.push("/login");
      },
      onError: (error: unknown) => {
        const message = extractErrorMessage(error, "Falha ao criar conta");
        toaster.create({ title: message, type: "error" });
      },
    },
  );

  return {
    handleRegister,
    isRegistering,
  };
}

export function useLogout() {
  const { clearUser } = useUser();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      clearUser();
      window.location.href = "/login";
    },
  });
}
