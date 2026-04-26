"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integration/api";
import type {
  IAppointment,
  ICreateAppointmentInput,
  IUpdateAppointmentInput,
} from "@/types/appointment";
import { toaster } from "@/components/ui/toaster";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

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

  const {
    mutateAsync: handleCreateAppointment,
    isPending: isCreatingAppointment,
  } = useMutation({
    mutationKey: ["createAppointment"],
    mutationFn: async (data: ICreateAppointmentInput) => {
      const response = await api.post<{
        message: string;
        data: IAppointment;
      }>("/appointments", data);
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toaster.create({
        title: "Agendamento criado com sucesso!",
        type: "success",
      });
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(
        error,
        "Erro ao criar o agendamento. Tente novamente.",
      );
      toaster.create({ title: message, type: "error" });
    },
  });

  return {
    handleCreateAppointment,
    isCreatingAppointment,
  };
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: handleUpdateAppointment,
    isPending: isUpdatingAppointment,
  } = useMutation({
    mutationKey: ["updateAppointment"],
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
      toaster.create({
        title: "Agendamento atualizado com sucesso!",
        type: "success",
      });
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(
        error,
        "Erro ao atualizar o agendamento. Tente novamente.",
      );
      toaster.create({ title: message, type: "error" });
    },
  });

  return {
    handleUpdateAppointment,
    isUpdatingAppointment,
  };
}
