"use client";

import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  Badge,
} from "@chakra-ui/react";
import Link from "next/link";
import type { IExam } from "@/types/exam";

export default function ExamCard({ exam }: { exam: IExam }) {
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
