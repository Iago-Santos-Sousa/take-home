import { z } from "zod";

export const ExamSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  description: z.string().optional(),
  preparation_instructions: z.string().optional(),
  duration_minutes: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^\d+$/.test(v),
      "A duração deve ser um número inteiro",
    )
    .refine((v) => !v || Number.parseInt(v, 10) >= 1, "Mínimo 1 minuto"),
  price: z
    .string()
    .optional()
    .refine((v) => !v || /^\d+(,\d{1,2})?$/.test(v), "Use o formato 99,99")
    .refine(
      (v) => !v || Number.parseFloat(v.replace(",", ".")) >= 0,
      "Preço não pode ser negativo",
    ),
  is_active: z.boolean(),
});

export type ExamFormValues = z.input<typeof ExamSchema>;
