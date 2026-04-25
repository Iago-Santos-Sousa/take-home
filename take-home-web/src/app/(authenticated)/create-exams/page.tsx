"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  Checkbox,
  Field,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useCreateExam } from "@/hooks/useExams";
import { toaster } from "@/components/ui/toaster";

const createExamSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(255, "Nome muito longo"),
  description: z.string().optional(),
  preparation_instructions: z.string().optional(),
  duration_minutes: z.coerce
    .number()
    .int()
    .min(1, "Mínimo 1 minuto")
    .optional()
    .or(z.literal("")),
  price: z.coerce
    .number()
    .min(0, "Preço não pode ser negativo")
    .optional()
    .or(z.literal("")),
  is_active: z.boolean().default(true),
});

type CreateExamForm = z.infer<typeof createExamSchema>;

export default function CreateExamsPage() {
  const createExam = useCreateExam();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateExamForm>({
    resolver: zodResolver(createExamSchema),
    defaultValues: { is_active: true },
  });

  const isActive = watch("is_active");

  const onSubmit = (data: CreateExamForm) => {
    createExam.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        preparation_instructions: data.preparation_instructions || undefined,
        duration_minutes:
          data.duration_minutes !== "" && data.duration_minutes !== undefined
            ? Number(data.duration_minutes)
            : undefined,
        price:
          data.price !== "" && data.price !== undefined
            ? Number(data.price)
            : undefined,
        is_active: data.is_active,
      },
      {
        onSuccess: () => {
          toaster.create({
            title: "Exame criado com sucesso!",
            type: "success",
          });
          reset();
        },
        onError: (error: unknown) => {
          const message =
            error instanceof AxiosError
              ? ((error.response?.data as { message?: string })?.message ??
                "Erro ao criar exame")
              : "Erro ao criar exame";
          toaster.create({ title: message, type: "error" });
        },
      },
    );
  };

  return (
    <Stack gap={6} maxW="2xl">
      <Stack gap={1}>
        <Heading size="xl">Criar Novo Exame</Heading>
        <Text color="gray.500" fontSize="sm">
          Apenas administradores podem criar exames.
        </Text>
      </Stack>

      <Box
        bg="white"
        rounded="xl"
        shadow="sm"
        p={6}
        borderWidth="1px"
        borderColor="gray.200"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack gap={5}>
            <Field.Root required invalid={!!errors.name}>
              <Field.Label>Nome do exame *</Field.Label>
              <Input
                placeholder="Ex: Hemograma Completo"
                {...register("name")}
              />
              <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.description}>
              <Field.Label>Descrição</Field.Label>
              <Textarea
                placeholder="Descreva o objetivo e o que o exame avalia..."
                rows={3}
                {...register("description")}
              />
              <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.preparation_instructions}>
              <Field.Label>Instruções de preparo</Field.Label>
              <Textarea
                placeholder="Ex: Jejum de 8 horas, evitar exercícios nas 24h anteriores..."
                rows={3}
                {...register("preparation_instructions")}
              />
              <Field.ErrorText>
                {errors.preparation_instructions?.message}
              </Field.ErrorText>
            </Field.Root>

            <HStack gap={4}>
              <Field.Root invalid={!!errors.duration_minutes} flex={1}>
                <Field.Label>Duração (minutos)</Field.Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="Ex: 30"
                  {...register("duration_minutes")}
                />
                <Field.ErrorText>
                  {errors.duration_minutes?.message}
                </Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.price} flex={1}>
                <Field.Label>Preço (R$)</Field.Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="Ex: 89.90"
                  {...register("price")}
                />
                <Field.ErrorText>{errors.price?.message}</Field.ErrorText>
              </Field.Root>
            </HStack>

            <Checkbox.Root
              checked={isActive}
              onCheckedChange={(e) => setValue("is_active", Boolean(e.checked))}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                Exame ativo (visível para pacientes)
              </Checkbox.Label>
            </Checkbox.Root>

            <Button
              type="submit"
              colorPalette="blue"
              loading={createExam.isPending}
              loadingText="Criando..."
              alignSelf="flex-start"
              px={8}
            >
              Criar Exame
            </Button>
          </Stack>
        </form>
      </Box>
    </Stack>
  );
}
