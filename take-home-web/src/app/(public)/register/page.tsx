"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRegister } from "@/hooks/useAuth";

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { handleRegister, isRegistering } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    handleRegister({ ...data, role: "user" });
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#f0f4ff"
      px={4}
    >
      <Box
        bg="white"
        p={10}
        rounded="2xl"
        shadow="lg"
        w="full"
        maxW="420px"
        borderWidth="1px"
        borderColor="#dbeafe"
      >
        <Stack gap={8}>
          <Stack gap={2} textAlign="center">
            <Text fontSize="3xl" lineHeight={1}>
              🔬
            </Text>
            <Heading size="xl" color="#1e40af" fontWeight="800">
              Criar Conta
            </Heading>
            <Text color="#64748b" fontSize="sm">
              Cadastre-se para agendar seus exames
            </Text>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap={5}>
              <Field.Root invalid={!!errors.name}>
                <Field.Label
                  style={{
                    color: "#374151",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Nome completo
                </Field.Label>
                <Input
                  placeholder="João da Silva"
                  {...register("name")}
                  style={{
                    background: "#f8fafc",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    width: "100%",
                    outline: "none",
                  }}
                />
                <Field.ErrorText
                  style={{ color: "#dc2626", fontSize: "0.8rem" }}
                >
                  {errors.name?.message}
                </Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.email}>
                <Field.Label
                  style={{
                    color: "#374151",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  E-mail
                </Field.Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  style={{
                    background: "#f8fafc",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    width: "100%",
                    outline: "none",
                  }}
                />
                <Field.ErrorText
                  style={{ color: "#dc2626", fontSize: "0.8rem" }}
                >
                  {errors.email?.message}
                </Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors.password}>
                <Field.Label
                  style={{
                    color: "#374151",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Senha
                </Field.Label>
                <Input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  {...register("password")}
                  style={{
                    background: "#f8fafc",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    width: "100%",
                    outline: "none",
                  }}
                />
                <Field.ErrorText
                  style={{ color: "#dc2626", fontSize: "0.8rem" }}
                >
                  {errors.password?.message}
                </Field.ErrorText>
              </Field.Root>

              <Button
                type="submit"
                w="full"
                loading={isRegistering}
                loadingText="Criando conta..."
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "4px",
                  cursor: "pointer",
                  border: "none",
                  letterSpacing: "0.025em",
                }}
              >
                Criar Conta
              </Button>
            </Stack>
          </form>

          <Text textAlign="center" fontSize="sm" style={{ color: "#64748b" }}>
            Já tem conta?{" "}
            <Link href="/login" style={{ color: "#2563eb", fontWeight: 700 }}>
              Faça login
            </Link>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
