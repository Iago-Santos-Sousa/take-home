import { addMinutes, format, parse, setHours, setMinutes } from "date-fns";

export const validateBusinessHours = (
  localDateTime: string,
  examDurationMinutes: number | undefined,
): string | null => {
  const parsed = parse(localDateTime, "yyyy-MM-dd'T'HH:mm", new Date());
  if (Number.isNaN(parsed.getTime())) {
    return "Data e horário inválidos";
  }

  const startWork = setMinutes(setHours(new Date(parsed), 8), 0);
  const endWork = setMinutes(setHours(new Date(parsed), 17), 30);
  const duration = examDurationMinutes ?? 60;
  const endAppointment = addMinutes(parsed, duration);

  if (parsed < startWork || parsed >= endWork) {
    return "O agendamento deve iniciar entre 08:00 e 17:30";
  }

  if (endAppointment > endWork) {
    const lastStart = addMinutes(endWork, -duration);
    return `O exame termina fora do horário comercial. Último horário possível para este exame: ${format(lastStart, "HH:mm")}`;
  }

  return null;
};
