import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { PageOptionsDto } from "@/common/dtos";

export class AppointmentPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: "Filtrar por status do agendamento",
    example: "pending",
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}
