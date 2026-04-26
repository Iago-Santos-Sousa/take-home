import { AxiosError } from "axios";
import { IApiErrorResponse } from "@/types/api";

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as IApiErrorResponse | undefined;
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message))
      return (data.message as string[]).join(", ");
  }

  return fallback;
}
