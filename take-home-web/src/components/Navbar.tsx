"use client";

import React from "react";
import { Box, Flex, HStack, Text, Button, Badge } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useAuth";

interface NavbarProps {
  userName: string;
  userRole: string;
}

export default function Navbar({ userName, userRole }: NavbarProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const isAdmin = userRole === "admin";

  const linkStyle = (href: string): React.CSSProperties =>
    pathname.startsWith(href)
      ? {
          fontWeight: 700,
          color: "white",
          background: "rgba(255,255,255,0.18)",
          padding: "5px 12px",
          borderRadius: "6px",
          textDecoration: "none",
        }
      : {
          color: "rgba(255,255,255,0.82)",
          padding: "5px 12px",
          borderRadius: "6px",
          textDecoration: "none",
        };

  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #1e40af, #2563eb)",
        borderBottom: "none",
        padding: "0 24px",
        boxShadow: "0 2px 12px rgba(37,99,235,0.18)",
      }}
    >
      <Flex maxW="7xl" mx="auto" justify="space-between" align="center" py={3}>
        <HStack gap={6}>
          <Text
            fontWeight="800"
            fontSize="lg"
            style={{ color: "white", letterSpacing: "-0.01em" }}
          >
            🔬 ExamPortal
          </Text>
          <HStack gap={1} display={{ base: "none", md: "flex" }}>
            <Link href="/exams" style={linkStyle("/exams")}>
              <Text fontSize="sm">Exames</Text>
            </Link>
            <Link href="/appointments" style={linkStyle("/appointments")}>
              <Text fontSize="sm">Agendamentos</Text>
            </Link>
            {isAdmin && (
              <Link href="/create-exams" style={linkStyle("/create-exams")}>
                <Text fontSize="sm">Criar Exame</Text>
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" style={linkStyle("/admin")}>
                <Text fontSize="sm">Admin</Text>
              </Link>
            )}
          </HStack>
        </HStack>

        <HStack gap={3}>
          <HStack gap={2}>
            <Text
              fontSize="sm"
              style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}
            >
              {userName}
            </Text>
            {isAdmin && (
              <Badge
                size="sm"
                style={{
                  background: "rgba(255,255,255,0.22)",
                  color: "white",
                  borderRadius: "999px",
                  padding: "2px 10px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                ADMIN
              </Badge>
            )}
          </HStack>
          <Button
            size="sm"
            loading={logout.isPending}
            onClick={() => logout.mutate()}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1.5px solid rgba(255,255,255,0.4)",
              borderRadius: "6px",
              padding: "4px 14px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Sair
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}
