"use client";

import {
  Badge,
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Input,
  Portal,
  Skeleton,
  Stack,
  Text,
  Dialog,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { AxiosError } from "axios";
import { useAppointments, useUpdateAppointment } from "@/hooks/useAppointments";
import { toaster } from "@/components/ui/toaster";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { STATUS_COLORS, STATUS_LABELS } from "@/types/appointment";

function AppointmentCard({
  appointment,
  onEdit,
}: {
  appointment: Appointment;
  onEdit: (a: Appointment) => void;
}) {
  const isPast = new Date(appointment.scheduled_at) < new Date();

  return (
    <Box
      bg="white"
      rounded="xl"
      shadow="sm"
      p={5}
      borderWidth="1px"
      borderColor="gray.200"
      opacity={appointment.status === "cancelled" ? 0.6 : 1}
    >
      <Stack gap={3}>
        <HStack justify="space-between" align="start" flexWrap="wrap" gap={2}>
          <Heading size="sm" color="gray.800">
            {appointment.exam?.name ?? `Exame #${appointment.exam_id}`}
          </Heading>
          <Badge colorPalette={STATUS_COLORS[appointment.status]} size="sm">
            {STATUS_LABELS[appointment.status]}
          </Badge>
        </HStack>

        <Stack gap={1}>
          <HStack gap={2} fontSize="sm">
            <Text color="gray.500">📅 Data:</Text>
            <Text fontWeight="medium">
              {format(
                new Date(appointment.scheduled_at),
                "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                { locale: ptBR },
              )}
            </Text>
          </HStack>
          {appointment.notes && (
            <HStack gap={2} fontSize="sm" align="start">
              <Text color="gray.500" flexShrink={0}>
                📝 Obs:
              </Text>
              <Text color="gray.600">{appointment.notes}</Text>
            </HStack>
          )}
        </Stack>

        {appointment.status !== "cancelled" && !isPast && (
          <Button
            size="sm"
            variant="outline"
            colorPalette="blue"
            onClick={() => onEdit(appointment)}
            alignSelf="flex-start"
          >
            Editar
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default function AppointmentsPage() {
  const { data: appointments, isLoading, isError } = useAppointments();
  const updateAppointment = useUpdateAppointment();

  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [newScheduledAt, setNewScheduledAt] = useState("");

  const minDateTime = new Date();
  minDateTime.setMinutes(minDateTime.getMinutes() + 30);
  const minDateTimeStr = minDateTime.toISOString().slice(0, 16);

  const openEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    const d = new Date(appointment.scheduled_at);
    setNewScheduledAt(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
    );
  };

  const handleUpdate = () => {
    if (!editingAppointment || !newScheduledAt) return;

    updateAppointment.mutate(
      {
        id: editingAppointment.appointment_id,
        data: { scheduled_at: new Date(newScheduledAt).toISOString() },
      },
      {
        onSuccess: () => {
          toaster.create({
            title: "Agendamento atualizado!",
            type: "success",
          });
          setEditingAppointment(null);
        },
        onError: (error: unknown) => {
          const message =
            error instanceof AxiosError
              ? ((error.response?.data as { message?: string })?.message ??
                "Erro ao atualizar")
              : "Erro ao atualizar";
          toaster.create({ title: message, type: "error" });
        },
      },
    );
  };

  const handleCancel = () => {
    if (!editingAppointment) return;
    updateAppointment.mutate(
      {
        id: editingAppointment.appointment_id,
        data: { status: "cancelled" },
      },
      {
        onSuccess: () => {
          toaster.create({ title: "Agendamento cancelado", type: "info" });
          setEditingAppointment(null);
        },
      },
    );
  };

  return (
    <Stack gap={6}>
      <Heading size="xl">Meus Agendamentos</Heading>

      {isError && (
        <Box
          bg="red.50"
          p={4}
          rounded="lg"
          borderWidth="1px"
          borderColor="red.200"
        >
          <Text color="red.600">Erro ao carregar agendamentos.</Text>
        </Box>
      )}

      {isLoading && (
        <Stack gap={4}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="120px" rounded="xl" />
          ))}
        </Stack>
      )}

      {!isLoading && appointments?.length === 0 && (
        <Box textAlign="center" py={16} bg="white" rounded="xl" shadow="sm">
          <Text fontSize="3xl" mb={3}>
            📅
          </Text>
          <Text fontSize="lg" color="gray.500" mb={4}>
            Você ainda não tem agendamentos
          </Text>
          <a href="/exams">
            <Button colorPalette="blue">Buscar exames</Button>
          </a>
        </Box>
      )}

      <Stack gap={4}>
        {appointments?.map((appointment) => (
          <AppointmentCard
            key={appointment.appointment_id}
            appointment={appointment}
            onEdit={openEdit}
          />
        ))}
      </Stack>

      {/* Edit Dialog */}
      <Dialog.Root
        open={!!editingAppointment}
        onOpenChange={(e) => !e.open && setEditingAppointment(null)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="md" p={6}>
              <Stack gap={5}>
                <Dialog.Title>
                  <Heading size="md">Editar Agendamento</Heading>
                </Dialog.Title>

                <Field.Root required>
                  <Field.Label>Nova data e horário</Field.Label>
                  <Input
                    type="datetime-local"
                    min={minDateTimeStr}
                    value={newScheduledAt}
                    onChange={(e) => setNewScheduledAt(e.target.value)}
                  />
                </Field.Root>

                <HStack justify="space-between" gap={3}>
                  <Button
                    variant="outline"
                    colorPalette="red"
                    size="sm"
                    loading={updateAppointment.isPending}
                    onClick={handleCancel}
                  >
                    Cancelar agendamento
                  </Button>
                  <HStack gap={2}>
                    <Dialog.CloseTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Fechar
                      </Button>
                    </Dialog.CloseTrigger>
                    <Button
                      colorPalette="blue"
                      size="sm"
                      loading={updateAppointment.isPending}
                      loadingText="Salvando..."
                      onClick={handleUpdate}
                    >
                      Salvar
                    </Button>
                  </HStack>
                </HStack>
              </Stack>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Stack>
  );
}
