"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integration/api";
import type {
  IAppointment,
  IAppointmentsPageResponse,
  ICreateAppointmentInput,
  IUpdateAppointmentInput,
} from "@/types/appointment";
import { toast } from "sonner";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

interface IUseAppointmentsParams {
  page?: number;
  take?: number;
  status?: "pending" | "confirmed" | "cancelled";
}

export function useAppointments(params: IUseAppointmentsParams = {}) {
  const { page = 1, take = 10, status } = params;

  return useQuery<IAppointmentsPageResponse>({
    queryKey: ["appointments", { page, take, status }],
    queryFn: async () => {
      const response = await api.get<{
        message: string;
        data: IAppointmentsPageResponse;
      }>("/appointments", {
        params: {
          page,
          take,
          status,
        },
      });

      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
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
      toast.success("Agendamento criado com sucesso!");
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(
        error,
        "Erro ao criar o agendamento. Tente novamente.",
      );
      toast.error(message);
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
      toast.success("Agendamento atualizado com sucesso!");
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(
        error,
        "Erro ao atualizar o agendamento. Tente novamente.",
      );
      toast.error(message);
    },
  });

  return {
    handleUpdateAppointment,
    isUpdatingAppointment,
  };
}
