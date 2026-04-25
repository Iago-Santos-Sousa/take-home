"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/integration/api";
import type {
  Exam,
  ExamsPageResponse,
  CreateExamInput,
  UpdateExamInput,
} from "@/types/exam";

interface UseExamsParams {
  search?: string;
  page?: number;
  take?: number;
}

export function useExams(params: UseExamsParams = {}) {
  const { search = "", page = 1, take = 10 } = params;

  return useQuery<ExamsPageResponse>({
    queryKey: ["exams", { search, page, take }],
    queryFn: async () => {
      const response = await api.get<ExamsPageResponse>("/exams", {
        params: {
          search: search || undefined,
          page,
          take,
        },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 min — mirrors Redis TTL
  });
}

export function useExam(id: number) {
  return useQuery<Exam>({
    queryKey: ["exam", id],
    queryFn: async () => {
      const response = await api.get<{ message: string; data: Exam }>(
        `/exams/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExamInput) => {
      const response = await api.post<{ message: string; data: Exam }>(
        "/exams",
        data,
      );
      return response.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateExamInput }) => {
      const response = await api.patch<{ message: string; data: Exam }>(
        `/exams/${id}`,
        data,
      );
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["exams"] });
      void queryClient.invalidateQueries({ queryKey: ["exam", variables.id] });
    },
  });
}
