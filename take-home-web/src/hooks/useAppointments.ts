"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integration/api";
import type {
  IAppointment,
  ICreateAppointmentInput,
  IUpdateAppointmentInput,
} from "@/types/appointment";

export function useAppointments() {
  return useQuery<IAppointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await api.get<{
        message: string;
        data: IAppointment[];
      }>("/appointments");
      return response.data.data;
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateAppointmentInput) => {
      const response = await api.post<{
        message: string;
        data: IAppointment;
      }>("/appointments", data);
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: IUpdateAppointmentInput;
    }) => {
      const response = await api.patch<{
        message: string;
        data: IAppointment;
      }>(`/appointments/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
