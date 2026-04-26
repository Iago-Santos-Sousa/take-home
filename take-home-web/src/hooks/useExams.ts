"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integration/api";
import type {
  IExam,
  IExamsPageResponse,
  ICreateExamInput,
  IUpdateExamInput,
} from "@/types/exam";
import { toast } from "sonner";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

interface IUseExamsParams {
  search?: string;
  page?: number;
  take?: number;
}

export function useExams(params: IUseExamsParams = {}) {
  const { search = "", page = 1, take = 10 } = params;

  return useQuery<IExamsPageResponse>({
    queryKey: ["exams", { search, page, take }],
    queryFn: async () => {
      const response = await api.get<IExamsPageResponse>("/exams", {
        params: {
          search: search || undefined,
          page,
          take,
        },
      });

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 min — com Redis TTL
  });
}

export function useExam(id: number) {
  return useQuery<IExam>({
    queryKey: ["exam", id],
    queryFn: async () => {
      const response = await api.get<{ message: string; data: IExam }>(
        `/exams/${id}`,
      );

      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  const { mutateAsync: handleCreateExam, isPending: isCreatingExam } =
    useMutation({
      mutationKey: ["createExam"],
      mutationFn: async (data: ICreateExamInput) => {
        const response = await api.post<{ message: string; data: IExam }>(
          "/exams",
          data,
        );

        return response.data.data;
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ["exams"] });
        toast.success("Exame criado com sucesso!");
      },
      onError: (error: unknown) => {
        const message = extractErrorMessage(
          error,
          "Erro ao criar o exame. Tente novamente.",
        );
        toast.error(message);
      },
    });

  return {
    handleCreateExam,
    isCreatingExam,
  };
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  const { mutateAsync: handleUpdateExam, isPending: isUpdatingExam } =
    useMutation({
      mutationKey: ["updateExam"],
      mutationFn: async ({
        id,
        data,
      }: {
        id: number;
        data: IUpdateExamInput;
      }) => {
        const response = await api.patch<{ message: string; data: IExam }>(
          `/exams/${id}`,
          data,
        );

        return response.data.data;
      },
      onSuccess: (_data, variables) => {
        void queryClient.invalidateQueries({ queryKey: ["exams"] });
        void queryClient.invalidateQueries({
          queryKey: ["exam", variables.id],
        });
      },
      onError: (error: unknown) => {
        const message = extractErrorMessage(
          error,
          "Erro ao atualizar o exame. Tente novamente.",
        );
        toast.error(message);
      },
    });

  return {
    handleUpdateExam,
    isUpdatingExam,
  };
}
