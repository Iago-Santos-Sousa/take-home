import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { AppointmentStatus } from "../entities/appointment.entity";

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    example: "2025-12-26T10:00:00.000Z",
    description: "New ISO 8601 datetime (future date)",
  })
  @IsOptional()
  @IsDateString()
  scheduled_at?: string;

  @ApiPropertyOptional({ example: "Atualização de notas" })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
