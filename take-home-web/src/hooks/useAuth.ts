"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { api } from "@/integration/api";
import { useUser } from "@/contexts/user-context";

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

interface IApiErrorResponse {
  message: string;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as IApiErrorResponse | undefined;
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message))
      return (data.message as string[]).join(", ");
  }

  return fallback;
}

export function useLogin() {
  const { setUser } = useUser();

  return useMutation({
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
      // Full navigation so middleware runs fresh with the new cookie
      window.location.href = "/exams";
    },
    onError: (error: unknown) => {
      return extractErrorMessage(error, "Falha ao realizar login");
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: IRegisterInput) => {
      const response = await api.post("/user", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error: unknown) => {
      return extractErrorMessage(error, "Falha ao criar conta");
    },
  });
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
