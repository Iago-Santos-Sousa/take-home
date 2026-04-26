import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  HttpInternalServerError,
  HttpUnauthorizedError,
} from "@/utils/HttpResponseErros";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 500 && !originalRequest._retry) {
      originalRequest._retry = true;

      error = new HttpInternalServerError(
        "Ops! Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.",
      ) as unknown as AxiosError;
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      error = new HttpUnauthorizedError(
        "Acesso não autorizado. Por favor, faça login para continuar.",
      ) as unknown as AxiosError;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        return api(originalRequest);
      } catch {
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);
