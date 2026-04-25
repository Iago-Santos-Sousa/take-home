import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "../../user/entities/user.entity";
import { Exam } from "../../exams/entities/exam.entity";

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

@Entity("appointment")
export class Appointment {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ name: "appointment_id" })
  appointment_id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ApiProperty({ example: 1 })
  @Column({ name: "user_id" })
  user_id: number;

  @ManyToOne(() => Exam, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "exam_id" })
  exam: Exam;

  @ApiProperty({ example: 1 })
  @Column({ name: "exam_id" })
  exam_id: number;

  @ApiProperty({ example: "2025-12-25T14:30:00.000Z" })
  @Column({ name: "scheduled_at", type: "timestamptz" })
  scheduled_at: Date;

  @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.PENDING })
  @Column({
    name: "status",
    type: "varchar",
    length: 20,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @ApiPropertyOptional({ example: "Paciente com histórico de diabetes" })
  @Column({ name: "notes", type: "text", nullable: true })
  notes?: string;

  @ApiProperty()
  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
