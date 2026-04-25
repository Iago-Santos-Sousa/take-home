import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { isPast, parseISO } from "date-fns";
import { Appointment } from "./entities/appointment.entity";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { ExamsService } from "../exams/exams.service";

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly examsService: ExamsService,
  ) {}

  private validateNotInPast(scheduledAt: string | Date): void {
    const date =
      typeof scheduledAt === "string" ? parseISO(scheduledAt) : scheduledAt;
    if (isPast(date)) {
      throw new BadRequestException(
        "O agendamento não pode ser realizado para uma data no passado",
      );
    }
  }

  private async checkConflict(
    userId: number,
    scheduledAt: string | Date,
    excludeId?: number,
  ): Promise<void> {
    const date =
      typeof scheduledAt === "string" ? parseISO(scheduledAt) : scheduledAt;

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder("appointment")
      .where("appointment.user_id = :userId", { userId })
      .andWhere("appointment.scheduled_at = :scheduledAt", {
        scheduledAt: date,
      })
      .andWhere("appointment.status != :cancelled", { cancelled: "cancelled" });

    if (excludeId) {
      queryBuilder.andWhere("appointment.appointment_id != :excludeId", {
        excludeId,
      });
    }

    const existing = await queryBuilder.getOne();
    if (existing) {
      throw new ConflictException(
        "Você já possui um agendamento neste horário",
      );
    }
  }

  async create(
    userId: number,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    await this.examsService.findOne(createAppointmentDto.exam_id);
    this.validateNotInPast(createAppointmentDto.scheduled_at);
    await this.checkConflict(userId, createAppointmentDto.scheduled_at);

    const appointment = this.appointmentRepository.create({
      user_id: userId,
      exam_id: createAppointmentDto.exam_id,
      scheduled_at: parseISO(createAppointmentDto.scheduled_at),
      notes: createAppointmentDto.notes,
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAllByUser(userId: number): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { user_id: userId },
      relations: ["exam"],
      order: { scheduled_at: "ASC" },
    });
  }

  async update(
    appointmentId: number,
    userId: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointment_id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Agendamento com ID ${appointmentId} não encontrado`,
      );
    }

    if (appointment.user_id !== userId) {
      throw new ForbiddenException(
        "Você só pode atualizar seus próprios agendamentos",
      );
    }

    if (updateAppointmentDto.scheduled_at) {
      this.validateNotInPast(updateAppointmentDto.scheduled_at);
      await this.checkConflict(
        userId,
        updateAppointmentDto.scheduled_at,
        appointmentId,
      );
      appointment.scheduled_at = parseISO(updateAppointmentDto.scheduled_at);
    }

    if (updateAppointmentDto.notes !== undefined) {
      appointment.notes = updateAppointmentDto.notes;
    }

    if (updateAppointmentDto.status) {
      appointment.status = updateAppointmentDto.status;
    }

    return this.appointmentRepository.save(appointment);
  }
}
