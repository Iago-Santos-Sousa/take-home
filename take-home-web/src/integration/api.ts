import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // envia cookies automaticamente em requests client-side
});

// Interceptor de REQUEST
// Lê o token do cookie seguro e injeta no header Authorization
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // cookies() só funciona em Server Components / Server Actions
  // Em Client Components, o withCredentials acima já resolve
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Contexto client-side: o cookie é enviado automaticamente via withCredentials
  }

  return config;
});

// Interceptor de RESPONSE
// Trata erros de autenticação e tenta refresh do token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Token expirado → tenta refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // O refresh token também vem como cookie seguro do backend
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        // Tenta a requisição original novamente (o backend já setou o novo cookie)
        return api(originalRequest);
      } catch {
        // Refresh falhou → redireciona para login (client-side)
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);
