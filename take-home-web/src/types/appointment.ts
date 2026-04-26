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

export interface IAppointmentPageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IAppointmentsPageResponse {
  data: IAppointment[];
  meta: IAppointmentPageMeta;
}

export const STATUS_LABELS: Record<TAppointmentStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
};

/** Tailwind className strings para o Badge do ShadCN */
export const STATUS_COLORS: Record<TAppointmentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};
