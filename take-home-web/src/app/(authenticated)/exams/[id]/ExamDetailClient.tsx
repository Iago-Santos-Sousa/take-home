"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useExam } from "@/hooks/useExams";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { useUser } from "@/contexts/user-context";
import { validateBusinessHours } from "@/utils/validateBusinessHours";
import AppButton from "@/components/ui/AppButton";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiEdit2,
  FiFileText,
} from "react-icons/fi";

interface Props {
  examId: number;
}

export default function ExamDetailClient({ examId }: Props) {
  const router = useRouter();
  const { isAdmin } = useUser();

  const { data: exam, isLoading, isError } = useExam(examId);
  const { handleCreateAppointment, isCreatingAppointment } =
    useCreateAppointment();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");

  const minDateTime = new Date();
  minDateTime.setMinutes(minDateTime.getMinutes() + 30);
  const minDateTimeStr = minDateTime.toISOString().slice(0, 16);

  const handleSchedule = async () => {
    if (!scheduledAt) {
      toast.error("Selecione uma data e horário");
      return;
    }

    const businessHoursError = validateBusinessHours(
      scheduledAt,
      exam?.duration_minutes,
    );

    if (businessHoursError) {
      toast.error(businessHoursError);
      return;
    }

    try {
      await handleCreateAppointment({
        exam_id: examId,
        scheduled_at: new Date(scheduledAt).toISOString(),
        notes: notes || undefined,
      });

      setIsDialogOpen(false);
      setScheduledAt("");
      setNotes("");
      router.push("/appointments");
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  if (isError || !exam) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
        <p className="text-red-600 text-lg">Exame não encontrado.</p>
        <AppButton
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          Voltar
        </AppButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <AppButton variant="ghost" size="sm" onClick={() => router.back()}>
          <FiArrowLeft /> Voltar
        </AppButton>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-foreground">{exam.name}</h1>
            {exam.price !== undefined && exam.price !== null && (
              <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
                R$ {Number(exam.price).toFixed(2)}
              </Badge>
            )}
          </div>

          {exam.duration_minutes && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FiClock />
              <span>Duração:</span>
              <span className="font-medium text-foreground">
                {exam.duration_minutes} minutos
              </span>
            </div>
          )}

          {exam.description && (
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-foreground">Sobre o exame</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exam.description}
              </p>
            </div>
          )}

          {exam.preparation_instructions && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-2">
              <p className="font-semibold text-blue-700 flex items-center gap-1">
                <FiFileText /> Instruções de preparo
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">
                {exam.preparation_instructions}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-2">
            <AppButton size="lg" onClick={() => setIsDialogOpen(true)}>
              <FiCalendar /> Agendar este exame
            </AppButton>
            {isAdmin && (
              <AppButton
                variant="outline"
                size="lg"
                onClick={() => router.push(`/exams/${examId}/edit`)}
              >
                <FiEdit2 /> Editar exame
              </AppButton>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar: {exam.name}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scheduled-at">
                Data e Horário <span className="text-destructive">*</span>
              </Label>
              <Input
                id="scheduled-at"
                type="datetime-local"
                min={minDateTimeStr}
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Horário comercial: 08:00 às 17:30. Duração considerada:{" "}
                {exam.duration_minutes ?? 60} min.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Ex: histórico de alergias, medicamentos em uso..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <AppButton variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </AppButton>
            <AppButton
              disabled={isCreatingAppointment}
              onClick={handleSchedule}
            >
              {isCreatingAppointment ? "Agendando..." : "Confirmar agendamento"}
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
