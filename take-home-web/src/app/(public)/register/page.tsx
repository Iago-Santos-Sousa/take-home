"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { FiUserPlus, FiActivity } from "react-icons/fi";
import { useRegister } from "@/hooks/useAuth";
import FormInput from "@/components/form/FormInput";
import AppButton from "@/components/ui/AppButton";

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
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-sky-200 bg-white p-8 shadow-lg">
        <div className="space-y-2 text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 mx-auto">
            <FiActivity size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-900">Criar Conta</h1>
          <p className="text-sm text-slate-500">
            Cadastre-se para agendar seus exames
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <FormInput
            label="Nome completo"
            placeholder="João da Silva"
            requiredMark
            error={errors.name?.message}
            {...register("name")}
          />

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
            placeholder="Mínimo 6 caracteres"
            requiredMark
            error={errors.password?.message}
            {...register("password")}
          />

          <AppButton type="submit" loading={isRegistering} className="w-full">
            <FiUserPlus size={16} />
            {isRegistering ? "Criando conta..." : "Criar Conta"}
          </AppButton>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
