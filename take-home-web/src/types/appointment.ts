import { Exam } from "./exam";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export interface Appointment {
  appointment_id: number;
  user_id: number;
  exam_id: number;
  exam: Exam;
  scheduled_at: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentInput {
  exam_id: number;
  scheduled_at: string;
  notes?: string;
}

export interface UpdateAppointmentInput {
  scheduled_at?: string;
  notes?: string;
  status?: AppointmentStatus;
}

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
};

export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: "yellow",
  confirmed: "green",
  cancelled: "red",
};
