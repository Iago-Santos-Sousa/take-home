import type { Metadata } from "next";
import axios from "axios";
import ExamDetailClient from "./ExamDetailClient";
import type { IExam } from "@/types/exam";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchExam(id: string): Promise<IExam | null> {
  try {
    const response = await axios.get<{ data: IExam }>(
      `${process.env.NEXT_PUBLIC_API_URL}/exams/${id}`,
    );
    return response.data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const exam = await fetchExam(id);

  if (!exam) {
    return {
      title: "Exame não encontrado | ExamPortal",
    };
  }

  const description =
    exam.description ??
    `Agende o exame ${exam.name} de forma fácil e rápida no ExamPortal.`;

  return {
    title: `${exam.name} | ExamPortal`,
    description,
    openGraph: {
      title: `${exam.name} | ExamPortal`,
      description,
      type: "website",
    },
  };
}

export default async function ExamDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ExamDetailClient examId={Number(id)} />;
}
