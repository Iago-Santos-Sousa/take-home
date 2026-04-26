"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useExam, useUpdateExam } from "@/hooks/useExams";
import { toast } from "sonner";
import FormInput from "@/components/form/FormInput";
import FormTextarea from "@/components/form/FormTextarea";
import AppButton from "@/components/ui/AppButton";
import { ExamSchema } from "@/schemas/exam";
import { ExamFormValues } from "@/schemas/exam";

interface Props {
  examId: number;
}

export default function EditExamClient({ examId }: Props) {
  const router = useRouter();
  const { data: exam, isLoading, isError } = useExam(examId);
  const { handleUpdateExam, isUpdatingExam } = useUpdateExam();
  const [isActive, setIsActive] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(ExamSchema),
    defaultValues: {
      name: "",
      description: "",
      preparation_instructions: "",
      duration_minutes: "",
      price: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (!exam) return;

    setIsActive(exam.is_active);
    setValue("is_active", exam.is_active, { shouldValidate: true });

    reset({
      name: exam.name,
      description: exam.description ?? "",
      preparation_instructions: exam.preparation_instructions ?? "",
      duration_minutes: exam.duration_minutes
        ? String(exam.duration_minutes)
        : "",
      price:
        exam.price !== undefined && exam.price !== null
          ? Number(exam.price).toFixed(2).replace(".", ",")
          : "",
      is_active: exam.is_active,
    });
  }, [exam, reset, setValue]);

  const onSubmit: SubmitHandler<ExamFormValues> = async (data) => {
    const payLoad = {
      id: examId,
      data: {
        name: data.name,
        description: data.description || "",
        preparation_instructions: data.preparation_instructions || "",
        duration_minutes: data.duration_minutes
          ? Number.parseInt(data.duration_minutes, 10)
          : undefined,
        price: data.price
          ? Number.parseFloat(data.price.replace(",", "."))
          : undefined,
        is_active: isActive,
      },
    };

    await handleUpdateExam(payLoad);
    toast.success("Exame atualizado com sucesso!");
    router.push(`/exams/${examId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !exam) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
        <p className="text-red-600 text-lg">Exame não encontrado.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <AppButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-2 px-0 text-muted-foreground hover:text-foreground"
        >
          <FiArrowLeft size={14} /> Voltar
        </AppButton>
        <h1 className="text-3xl font-bold text-gray-900">Editar Exame</h1>
        <p className="text-sm text-gray-500">
          Apenas administradores podem editar exames.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <FormInput
            label="Nome do exame"
            requiredMark
            placeholder="Ex: Hemograma Completo"
            error={errors.name?.message}
            {...register("name")}
          />

          <FormTextarea
            label="Descrição"
            rows={3}
            placeholder="Descreva o objetivo e o que o exame avalia..."
            error={errors.description?.message}
            {...register("description")}
          />

          <FormTextarea
            label="Instruções de preparo"
            rows={3}
            placeholder="Ex: Jejum de 8 horas..."
            error={errors.preparation_instructions?.message}
            {...register("preparation_instructions")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Duração (minutos)"
              type="number"
              min={1}
              step={1}
              placeholder="Ex: 30"
              error={errors.duration_minutes?.message}
              onKeyDown={(e) => {
                if ([".", ",", "e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              {...register("duration_minutes")}
            />

            <FormInput
              label="Preço (R$)"
              type="text"
              placeholder="Ex: 89,90"
              error={errors.price?.message}
              onInput={(e) => {
                const el = e.currentTarget;
                el.value = el.value
                  .replace(/[^0-9,]/g, "")
                  .replace(/(,.*),/g, "$1")
                  .replace(/,(\d{2}).+/, ",$1");
              }}
              {...register("price")}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => {
                const next = !isActive;
                setIsActive(next);
                setValue("is_active", next, { shouldValidate: true });
              }}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                isActive ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  isActive ? "translate-x-5" : ""
                }`}
              />
            </button>
            <span className="text-sm font-medium text-slate-700">
              Exame ativo (visível para pacientes)
            </span>
          </label>

          <AppButton type="submit" loading={isUpdatingExam}>
            <FiSave size={16} />
            {isUpdatingExam ? "Salvando..." : "Salvar alterações"}
          </AppButton>
        </form>
      </div>
    </div>
  );
}
