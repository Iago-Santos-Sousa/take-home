/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface IExam {
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

export interface IExamPageMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IExamsPageResponse {
  data: IExam[];
  meta: IExamPageMeta;
}

export interface ICreateExamInput {
  name: string;
  description?: string;
  preparation_instructions?: string;
  duration_minutes?: number;
  price?: number;
  is_active?: boolean;
}

export interface IUpdateExamInput extends Partial<ICreateExamInput> {}
