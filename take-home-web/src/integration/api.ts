import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  HttpInternalServerError,
  HttpUnauthorizedError,
} from "@/utils/HttpResponseErros";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

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

      if (
        typeof window !== "undefined" &&
        window.location.pathname === "/login"
      ) {
        error = new HttpUnauthorizedError(
          "Credenciais inválidas",
        ) as unknown as AxiosError;

        return Promise.reject(error);
      }

      if (isRefreshing && refreshPromise) {
        await refreshPromise;
        return api(originalRequest);
      }

      isRefreshing = true;

      refreshPromise = (async () => {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {},
            { withCredentials: true },
          );

          isRefreshing = false;
          refreshPromise = null;
        } catch (refreshError) {
          isRefreshing = false;
          refreshPromise = null;

          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/login"
          ) {
            window.location.href = "/login";
          }
          throw refreshError;
        }
      })();

      try {
        await refreshPromise;
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
