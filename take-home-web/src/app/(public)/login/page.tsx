"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { FiLogIn, FiActivity } from "react-icons/fi";
import { useLogin } from "@/hooks/useAuth";
import FormInput from "@/components/form/FormInput";
import AppButton from "@/components/ui/AppButton";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { handleLogin, isLoggingIn } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    handleLogin(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-sky-200 bg-white p-8 shadow-lg">
        <div className="space-y-2 text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 mx-auto">
            <FiActivity size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-900">ExamPortal</h1>
          <p className="text-sm text-slate-500">
            Faça login para agendar seus exames
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <FormInput
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            requiredMark
            error={errors.email?.message}
            {...register("email")}
          />

          <FormInput
            label="Senha"
            type="password"
            placeholder="••••••••"
            requiredMark
            error={errors.password?.message}
            {...register("password")}
          />

          <AppButton type="submit" loading={isLoggingIn} className="w-full">
            <FiLogIn size={16} />
            {isLoggingIn ? "Entrando..." : "Entrar"}
          </AppButton>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Não tem conta?{" "}
          <Link
            href="/register"
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Cadastre-se agora
          </Link>
        </p>
      </div>
    </div>
  );
}
