"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  Field,
  Heading,
  HStack,
  Input,
  Portal,
  Skeleton,
  Stack,
  Text,
  Textarea,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useExam } from "@/hooks/useExams";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { toaster } from "@/components/ui/toaster";

interface Props {
  examId: number;
}

export default function ExamDetailClient({ examId }: Props) {
  const router = useRouter();
  const { data: exam, isLoading, isError } = useExam(examId);
  const createAppointment = useCreateAppointment();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  const minDateTime = new Date();
  minDateTime.setMinutes(minDateTime.getMinutes() + 30);
  const minDateTimeStr = minDateTime.toISOString().slice(0, 16);

  const handleSchedule = () => {
    if (!scheduledAt) {
      toaster.create({ title: "Selecione uma data e horário", type: "error" });
      return;
    }

    createAppointment.mutate(
      {
        exam_id: examId,
        scheduled_at: new Date(scheduledAt).toISOString(),
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          toaster.create({
            title: "Agendamento criado com sucesso!",
            type: "success",
          });
          setIsDialogOpen(false);
          setScheduledAt("");
          setNotes("");
          router.push("/appointments");
        },
        onError: (error: unknown) => {
          const message =
            error instanceof AxiosError
              ? ((error.response?.data as { message?: string })?.message ??
                "Erro ao criar agendamento")
              : "Erro ao criar agendamento";
          toaster.create({ title: message, type: "error" });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Stack gap={4} maxW="2xl">
        <Skeleton height="36px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="80px" />
        <Skeleton height="40px" width="160px" />
      </Stack>
    );
  }

  if (isError || !exam) {
    return (
      <Box bg="red.50" p={6} rounded="lg" textAlign="center">
        <Text color="red.600" fontSize="lg">
          Exame não encontrado.
        </Text>
        <Button
          mt={4}
          variant="outline"
          colorPalette="blue"
          onClick={() => router.back()}
        >
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Stack gap={6} maxW="2xl">
      <HStack gap={2}>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          ← Voltar
        </Button>
      </HStack>

      <Box
        bg="white"
        rounded="xl"
        shadow="sm"
        p={6}
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Stack gap={5}>
          <HStack justify="space-between" align="start" flexWrap="wrap" gap={3}>
            <Heading size="xl">{exam.name}</Heading>
            {exam.price !== undefined && exam.price !== null && (
              <Badge colorPalette="green" fontSize="md" px={3} py={1}>
                R$ {Number(exam.price).toFixed(2)}
              </Badge>
            )}
          </HStack>

          {exam.duration_minutes && (
            <HStack gap={2}>
              <Text fontSize="sm" color="gray.500">
                ⏱ Duração:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {exam.duration_minutes} minutos
              </Text>
            </HStack>
          )}

          {exam.description && (
            <Stack gap={1}>
              <Text fontWeight="semibold" color="gray.700">
                Sobre o exame
              </Text>
              <Text color="gray.600" fontSize="sm" lineHeight="tall">
                {exam.description}
              </Text>
            </Stack>
          )}

          {exam.preparation_instructions && (
            <Box
              bg="blue.50"
              p={4}
              rounded="lg"
              borderWidth="1px"
              borderColor="blue.200"
            >
              <Stack gap={2}>
                <Text fontWeight="semibold" color="blue.700">
                  📋 Instruções de preparo
                </Text>
                <Text color="blue.800" fontSize="sm" lineHeight="tall">
                  {exam.preparation_instructions}
                </Text>
              </Stack>
            </Box>
          )}

          <Button
            colorPalette="blue"
            size="lg"
            onClick={() => setIsDialogOpen(true)}
            mt={2}
          >
            📅 Agendar este exame
          </Button>
        </Stack>
      </Box>

      {/* Modal de agendamento */}
      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={(e) => setIsDialogOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="md" p={6}>
              <Stack gap={5}>
                <Dialog.Title>
                  <Heading size="md">Agendar: {exam.name}</Heading>
                </Dialog.Title>

                <Field.Root required>
                  <Field.Label>Data e Horário</Field.Label>
                  <Input
                    type="datetime-local"
                    min={minDateTimeStr}
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                  />
                  <Field.HelperText>
                    Selecione uma data e horário futuros
                  </Field.HelperText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>Observações (opcional)</Field.Label>
                  <Textarea
                    placeholder="Ex: histórico de alergias, medicamentos em uso..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </Field.Root>

                <HStack justify="flex-end" gap={3}>
                  <Dialog.CloseTrigger asChild>
                    <Button variant="ghost">Cancelar</Button>
                  </Dialog.CloseTrigger>
                  <Button
                    colorPalette="blue"
                    loading={createAppointment.isPending}
                    loadingText="Agendando..."
                    onClick={handleSchedule}
                  >
                    Confirmar agendamento
                  </Button>
                </HStack>
              </Stack>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Stack>
  );
}
