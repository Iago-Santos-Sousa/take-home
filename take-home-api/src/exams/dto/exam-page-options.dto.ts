import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { PageOptionsDto } from "@/common/dtos";

export class ExamPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    example: "Hemograma",
    description: "Procure pelo nome do exame",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly search?: string;
}
