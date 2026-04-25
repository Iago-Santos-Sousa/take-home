import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";
import { PageOptionsDto } from "@/common/dtos";

export class ExamPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    example: "Hemograma",
    description: "Search by exam name",
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly search?: string;
}
