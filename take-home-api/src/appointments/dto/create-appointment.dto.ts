import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateAppointmentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  exam_id: number;

  @ApiProperty({
    example: "2025-12-25T14:30:00.000Z",
    description: "ISO 8601 datetime string for the appointment (future date)",
  })
  @IsDateString()
  scheduled_at: string;

  @ApiPropertyOptional({ example: "Paciente com histórico de diabetes" })
  @IsOptional()
  @IsString()
  notes?: string;
}
