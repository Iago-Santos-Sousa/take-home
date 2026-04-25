import { IExam } from "./exam";

export type TAppointmentStatus = "pending" | "confirmed" | "cancelled";

export interface IAppointment {
  appointment_id: number;
  user_id: number;
  exam_id: number;
  exam: IExam;
  scheduled_at: string;
  status: TAppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ICreateAppointmentInput {
  exam_id: number;
  scheduled_at: string;
  notes?: string;
}

export interface IUpdateAppointmentInput {
  scheduled_at?: string;
  notes?: string;
  status?: TAppointmentStatus;
}

export const STATUS_LABELS: Record<TAppointmentStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
};

export const STATUS_COLORS: Record<TAppointmentStatus, string> = {
  pending: "yellow",
  confirmed: "green",
  cancelled: "red",
};
