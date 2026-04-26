"use client";

import Link from "next/link";
import type { IExam } from "@/types/exam";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/ui/AppButton";
import { FiClock, FiFileText } from "react-icons/fi";

export default function ExamCard({ exam }: { exam: IExam }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-5 flex flex-col gap-3 hover:shadow-md hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground line-clamp-2">
          {exam.name}
        </h3>
        {exam.price !== undefined && exam.price !== null && (
          <Badge className="shrink-0 bg-green-100 text-green-800 border-green-200">
            R$ {Number(exam.price).toFixed(2)}
          </Badge>
        )}
      </div>

      {exam.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {exam.description}
        </p>
      )}

      <div className="flex gap-3 text-xs text-muted-foreground">
        {exam.duration_minutes && (
          <span className="flex items-center gap-1">
            <FiClock className="shrink-0" />
            {exam.duration_minutes} min
          </span>
        )}
        {exam.preparation_instructions && (
          <span className="flex items-center gap-1">
            <FiFileText className="shrink-0" />
            Preparo necessário
          </span>
        )}
      </div>

      <Link href={`/exams/${exam.exam_id}`} className="mt-auto">
        <AppButton variant="outline" size="sm" className="w-full">
          Ver detalhes
        </AppButton>
      </Link>
    </div>
  );
}
