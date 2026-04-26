"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiPlusCircle } from "react-icons/fi";
import { useCreateExam } from "@/hooks/useExams";
import FormInput from "@/components/form/FormInput";
import FormTextarea from "@/components/form/FormTextarea";
import AppButton from "@/components/ui/AppButton";

import { ExamSchema } from "@/schemas/exam";
import { ExamFormValues } from "@/schemas/exam";

export default function CreateExamsPage() {
  const { handleCreateExam, isCreatingExam } = useCreateExam();
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
      is_active: true,
      name: "",
      description: "",
      preparation_instructions: "",
      duration_minutes: "",
      price: "",
    },
  });

  const onSubmit: SubmitHandler<ExamFormValues> = async (data) => {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      preparation_instructions: data.preparation_instructions || undefined,
      duration_minutes: data.duration_minutes
        ? Number.parseInt(data.duration_minutes, 10)
        : undefined,
      price: data.price
        ? Number.parseFloat(data.price.replace(",", "."))
        : undefined,
      is_active: isActive,
    };

    await handleCreateExam(payload);

    reset({
      name: "",
      description: "",
      preparation_instructions: "",
      duration_minutes: "",
      price: "",
      is_active: true,
    });

    setIsActive(true);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Criar Novo Exame
        </h1>
        <p className="text-sm text-slate-500">
          Apenas administradores podem criar exames.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
            placeholder="Ex: Jejum de 8 horas, evitar exercícios nas 24h anteriores..."
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

          <AppButton type="submit" loading={isCreatingExam}>
            <FiPlusCircle size={16} />
            {isCreatingExam ? "Criando..." : "Criar Exame"}
          </AppButton>
        </form>
      </div>
    </div>
  );
}
