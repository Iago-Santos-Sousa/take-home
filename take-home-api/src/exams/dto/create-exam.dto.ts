import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateExamDto {
  @ApiProperty({ example: "Hemograma Completo" })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: "Exame de sangue completo" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: "Jejum de 8 horas" })
  @IsOptional()
  @IsString()
  preparation_instructions?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration_minutes?: number;

  @ApiPropertyOptional({ example: 89.9 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
