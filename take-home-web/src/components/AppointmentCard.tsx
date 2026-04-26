"use client";

import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { STATUS_COLORS, STATUS_LABELS } from "@/types/appointment";
import type { IAppointment } from "@/types/appointment";

export default function AppointmentCard({
  appointment,
  onEdit,
}: {
  appointment: IAppointment;
  onEdit: (a: IAppointment) => void;
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
