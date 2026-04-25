export interface Exam {
  exam_id: number;
  name: string;
  description?: string;
  preparation_instructions?: string;
  duration_minutes?: number;
  price?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamPageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ExamsPageResponse {
  data: Exam[];
  meta: ExamPageMeta;
}

export interface CreateExamInput {
  name: string;
  description?: string;
  preparation_instructions?: string;
  duration_minutes?: number;
  price?: number;
  is_active?: boolean;
}

export interface UpdateExamInput extends Partial<CreateExamInput> {}
