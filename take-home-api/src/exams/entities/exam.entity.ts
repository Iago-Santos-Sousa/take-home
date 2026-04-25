import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

@Entity("exam")
export class Exam {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ name: "exam_id" })
  exam_id: number;

  @ApiProperty({ example: "Hemograma Completo" })
  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @ApiPropertyOptional({ example: "Análise completa das células sanguíneas" })
  @Column("text", { name: "description", nullable: true })
  description?: string;

  @ApiPropertyOptional({ example: "Jejum de 8 horas" })
  @Column("text", { name: "preparation_instructions", nullable: true })
  preparation_instructions?: string;

  @ApiPropertyOptional({ example: 30 })
  @Column("int", { name: "duration_minutes", nullable: true })
  duration_minutes?: number;

  @ApiPropertyOptional({ example: 89.9 })
  @Column("decimal", {
    name: "price",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  price?: number;

  @ApiProperty({ example: true })
  @Column("boolean", { name: "is_active", default: true })
  is_active: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
