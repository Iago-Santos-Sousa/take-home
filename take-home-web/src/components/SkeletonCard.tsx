"use client";

import { Box, Skeleton, Stack } from "@chakra-ui/react";

export default function SkeletonCard() {
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
