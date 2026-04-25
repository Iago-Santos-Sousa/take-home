"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integration/api";
import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "@/types/appointment";

export function useAppointments() {
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await api.get<{
        message: string;
        data: Appointment[];
      }>("/appointments");
      return response.data.data;
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentInput) => {
      const response = await api.post<{
        message: string;
        data: Appointment;
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
      data: UpdateAppointmentInput;
    }) => {
      const response = await api.patch<{
        message: string;
        data: Appointment;
      }>(`/appointments/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
