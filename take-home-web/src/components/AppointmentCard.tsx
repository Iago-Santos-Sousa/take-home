"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { STATUS_COLORS, STATUS_LABELS } from "@/types/appointment";
import type { IAppointment } from "@/types/appointment";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/ui/AppButton";
import { FiCalendar, FiFileText } from "react-icons/fi";

export default function AppointmentCard({
  appointment,
  onEdit,
}: {
  appointment: IAppointment;
  onEdit: (a: IAppointment) => void;
}) {
  const isPast = new Date(appointment.scheduled_at) < new Date();

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-border p-5 flex flex-col gap-3 ${
        appointment.status === "cancelled" ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground">
          {appointment.exam?.name ?? `Exame #${appointment.exam_id}`}
        </h3>
        <Badge className={STATUS_COLORS[appointment.status]}>
          {STATUS_LABELS[appointment.status]}
        </Badge>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <FiCalendar />
            Data:
          </span>
          <span className="font-medium">
            {format(
              new Date(appointment.scheduled_at),
              "dd 'de' MMMM 'de' yyyy '\u00e0s' HH:mm",
              { locale: ptBR },
            )}
          </span>
        </div>
        {appointment.notes && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground shrink-0 flex items-center gap-1">
              <FiFileText />
              Obs:
            </span>
            <span className="text-muted-foreground">{appointment.notes}</span>
          </div>
        )}
      </div>

      {appointment.status !== "cancelled" && !isPast && (
        <AppButton
          variant="outline"
          size="sm"
          onClick={() => onEdit(appointment)}
          className="self-start"
        >
          Editar
        </AppButton>
      )}
    </div>
  );
}
