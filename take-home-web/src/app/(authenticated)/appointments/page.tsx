"use client";

import {
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
import { useState } from "react";
import { useAppointments, useUpdateAppointment } from "@/hooks/useAppointments";
import { toaster } from "@/components/ui/toaster";
import type { IAppointment } from "@/types/appointment";
import AppointmentCard from "@/components/AppointmentCard";

export default function AppointmentsPage() {
  const { data: appointments, isLoading, isError } = useAppointments();
  const { handleUpdateAppointment, isUpdatingAppointment } =
    useUpdateAppointment();

  const [editingAppointment, setEditingAppointment] =
    useState<IAppointment | null>(null);

  const [newScheduledAt, setNewScheduledAt] = useState("");

  const minDateTime = new Date();
  minDateTime.setMinutes(minDateTime.getMinutes() + 30);
  const minDateTimeStr = minDateTime.toISOString().slice(0, 16);

  const openEdit = (appointment: IAppointment) => {
    setEditingAppointment(appointment);
    const d = new Date(appointment.scheduled_at);

    setNewScheduledAt(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
    );
  };

  const handleUpdate = async () => {
    if (!editingAppointment || !newScheduledAt) return;

    try {
      await handleUpdateAppointment({
        id: editingAppointment.appointment_id,
        data: { scheduled_at: new Date(newScheduledAt).toISOString() },
      });

      setEditingAppointment(null);
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
    }
  };

  const handleCancel = async () => {
    if (!editingAppointment) return;
    try {
      await handleUpdateAppointment({
        id: editingAppointment.appointment_id,
        data: { status: "cancelled" },
      });

      toaster.create({ title: "Agendamento cancelado", type: "info" });
      setEditingAppointment(null);
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
    }
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
                    loading={isUpdatingAppointment}
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
                      loading={isUpdatingAppointment}
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
