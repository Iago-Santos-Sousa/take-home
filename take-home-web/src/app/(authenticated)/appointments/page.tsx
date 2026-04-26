"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppointments, useUpdateAppointment } from "@/hooks/useAppointments";
import { toast } from "sonner";
import type { IAppointment } from "@/types/appointment";
import AppointmentCard from "@/components/AppointmentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import AppButton from "@/components/ui/AppButton";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
const TAKE = 8;

export default function AppointmentsPage() {
  const [page, setPage] = useState(1);

  const {
    data: appointmentsPage,
    isLoading,
    isError,
  } = useAppointments({
    page,
    take: TAKE,
  });

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

      toast.info("Agendamento cancelado");
      setEditingAppointment(null);
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-foreground">Meus Agendamentos</h1>

      {isError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-600">Erro ao carregar agendamentos.</p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-30 rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && appointmentsPage?.data.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <p className="text-3xl mb-3">
            <FiCalendar className="inline" />
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            Você ainda não tem agendamentos
          </p>
          <Link href="/exams">
            <AppButton>Buscar exames</AppButton>
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {appointmentsPage?.data.map((appointment) => (
          <AppointmentCard
            key={appointment.appointment_id}
            appointment={appointment}
            onEdit={openEdit}
          />
        ))}
      </div>

      {appointmentsPage && appointmentsPage.meta.pageCount > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <AppButton
            variant="outline"
            size="sm"
            disabled={!appointmentsPage.meta.hasPreviousPage}
            onClick={() => setPage((p) => p - 1)}
          >
            <FiChevronLeft /> Anterior
          </AppButton>
          <span className="text-sm text-muted-foreground">
            Página {appointmentsPage.meta.page} de{" "}
            {appointmentsPage.meta.pageCount}
          </span>
          <AppButton
            variant="outline"
            size="sm"
            disabled={!appointmentsPage.meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima <FiChevronRight />
          </AppButton>
        </div>
      )}

      <Dialog
        open={!!editingAppointment}
        onOpenChange={(open) => !open && setEditingAppointment(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-scheduled-at">Nova data e horário</Label>
              <Input
                id="new-scheduled-at"
                type="datetime-local"
                min={minDateTimeStr}
                value={newScheduledAt}
                onChange={(e) => setNewScheduledAt(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row sm:justify-between">
            <AppButton
              variant="danger"
              size="sm"
              disabled={isUpdatingAppointment}
              onClick={handleCancel}
            >
              Cancelar agendamento
            </AppButton>
            <div className="flex gap-2">
              <AppButton
                variant="ghost"
                size="sm"
                onClick={() => setEditingAppointment(null)}
              >
                Fechar
              </AppButton>
              <AppButton
                size="sm"
                disabled={isUpdatingAppointment}
                onClick={handleUpdate}
              >
                {isUpdatingAppointment ? "Salvando..." : "Salvar"}
              </AppButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
