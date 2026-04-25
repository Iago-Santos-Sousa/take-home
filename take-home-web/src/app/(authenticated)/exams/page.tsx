"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Input,
  Skeleton,
  Stack,
  Text,
  Badge,
} from "@chakra-ui/react";
import Link from "next/link";
import { useExams } from "@/hooks/useExams";
import { useDebounce } from "@/hooks/useDebounce";
import type { Exam } from "@/types/exam";

function ExamCard({ exam }: { exam: Exam }) {
  return (
    <Box
      bg="white"
      rounded="xl"
      shadow="sm"
      p={5}
      borderWidth="1px"
      borderColor="gray.200"
      _hover={{ shadow: "md", borderColor: "blue.300" }}
      transition="all 0.2s"
    >
      <Stack gap={3}>
        <HStack justify="space-between" align="start">
          <Heading size="sm" color="gray.800" lineClamp={2}>
            {exam.name}
          </Heading>
          {exam.price !== undefined && exam.price !== null && (
            <Badge colorPalette="green" flexShrink={0}>
              R$ {Number(exam.price).toFixed(2)}
            </Badge>
          )}
        </HStack>

        {exam.description && (
          <Text fontSize="sm" color="gray.600" lineClamp={2}>
            {exam.description}
          </Text>
        )}

        <HStack gap={3} fontSize="xs" color="gray.500">
          {exam.duration_minutes && <Text>⏱ {exam.duration_minutes} min</Text>}
          {exam.preparation_instructions && <Text>📋 Preparo necessário</Text>}
        </HStack>

        <Link href={`/exams/${exam.exam_id}`}>
          <Button colorPalette="blue" size="sm" w="full" variant="outline">
            Ver detalhes
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}

function SkeletonCard() {
  return (
    <Box
      bg="white"
      rounded="xl"
      shadow="sm"
      p={5}
      borderWidth="1px"
      borderColor="gray.200"
    >
      <Stack gap={3}>
        <Skeleton height="20px" />
        <Skeleton height="14px" />
        <Skeleton height="14px" width="60%" />
        <Skeleton height="32px" />
      </Stack>
    </Box>
  );
}

export default function ExamsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const search = useDebounce(searchInput, 400);
  const TAKE = 12;

  const { data, isLoading, isError } = useExams({ search, page, take: TAKE });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  return (
    <Stack gap={6}>
      <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Stack gap={1}>
          <Heading size="xl">Exames Disponíveis</Heading>
          <Text color="gray.500" fontSize="sm">
            {data?.meta.itemCount ?? 0} exames encontrados
          </Text>
        </Stack>
        <Input
          placeholder="Buscar exame por nome..."
          value={searchInput}
          onChange={handleSearchChange}
          maxW="320px"
          bg="white"
        />
      </HStack>

      {isError && (
        <Box
          bg="red.50"
          p={4}
          rounded="lg"
          borderWidth="1px"
          borderColor="red.200"
        >
          <Text color="red.600">Erro ao carregar exames. Tente novamente.</Text>
        </Box>
      )}

      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gap={4}
      >
        {isLoading
          ? Array.from({ length: TAKE }).map((_, i) => <SkeletonCard key={i} />)
          : data?.data.map((exam) => (
              <ExamCard key={exam.exam_id} exam={exam} />
            ))}
      </Grid>

      {!isLoading && data?.data.length === 0 && (
        <Box textAlign="center" py={16}>
          <Text fontSize="lg" color="gray.400">
            Nenhum exame encontrado para &quot;{searchInput}&quot;
          </Text>
        </Box>
      )}

      {data && data.meta.pageCount > 1 && (
        <HStack justify="center" gap={2} pt={4}>
          <Button
            variant="outline"
            size="sm"
            disabled={!data.meta.hasPreviousPage}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </Button>
          <Text fontSize="sm" color="gray.600">
            Página {data.meta.page} de {data.meta.pageCount}
          </Text>
          <Button
            variant="outline"
            size="sm"
            disabled={!data.meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima →
          </Button>
        </HStack>
      )}
    </Stack>
  );
}
