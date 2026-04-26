"use client";

import { useState } from "react";
import { useExams } from "@/hooks/useExams";
import { useDebounce } from "@/hooks/useDebounce";
import ExamCard from "@/components/ExamCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Input } from "@/components/ui/input";
import AppButton from "@/components/ui/AppButton";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
const TAKE = 8;

export default function ExamsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const search = useDebounce(searchInput, 400);

  const { data, isLoading, isError } = useExams({ search, page, take: TAKE });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">
            Exames Disponíveis
          </h1>
          <p className="text-sm text-muted-foreground">
            {data?.meta.itemCount ?? 0} exames encontrados
          </p>
        </div>
        <Input
          placeholder="Buscar exame por nome..."
          value={searchInput}
          onChange={handleSearchChange}
          className="max-w-xs bg-white"
        />
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-600">
            Erro ao carregar exames. Tente novamente.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: TAKE }).map((_, i) => <SkeletonCard key={i} />)
          : data?.data.map((exam) => (
              <ExamCard key={exam.exam_id} exam={exam} />
            ))}
      </div>

      {!isLoading && data?.data.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            Nenhum exame encontrado para &quot;{searchInput}&quot;
          </p>
        </div>
      )}

      {data && data.meta.pageCount > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <AppButton
            variant="outline"
            size="sm"
            disabled={!data.meta.hasPreviousPage}
            onClick={() => setPage((p) => p - 1)}
          >
            <FiChevronLeft /> Anterior
          </AppButton>
          <span className="text-sm text-muted-foreground">
            Página {data.meta.page} de {data.meta.pageCount}
          </span>
          <AppButton
            variant="outline"
            size="sm"
            disabled={!data.meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima <FiChevronRight />
          </AppButton>
        </div>
      )}
    </div>
  );
}
