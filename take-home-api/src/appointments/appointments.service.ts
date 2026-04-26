import {
  BadRequestException,
  Inject,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import {
  addMinutes,
  endOfDay,
  isPast,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import { Appointment } from "./entities/appointment.entity";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { ExamsService } from "../exams/exams.service";
import { AppointmentsRepository } from "./repositories/appointments.repository";
import { PageDto, PageMetaDto } from "@/common/dtos";
import { AppointmentPageOptionsDto } from "./dto/appointment-page-options.dto";

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentRepository: AppointmentsRepository,
    private readonly examsService: ExamsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private getExamDurationMinutes(duration?: number): number {
    return duration && duration > 0 ? duration : 60;
  }

  private validateNotInPast(scheduledAt: string | Date): void {
    const date =
      typeof scheduledAt === "string" ? parseISO(scheduledAt) : scheduledAt;

    if (isPast(date)) {
      throw new BadRequestException(
        "O agendamento não pode ser realizado para uma data no passado",
      );
    }
  }

  private validateBusinessHours(
    scheduledAt: string | Date,
    durationMinutes: number,
  ): void {
    const date =
      typeof scheduledAt === "string" ? parseISO(scheduledAt) : scheduledAt;

    const workStart = setMinutes(setHours(new Date(date), 8), 0);
    const workEnd = setMinutes(setHours(new Date(date), 17), 30);
    const appointmentEnd = addMinutes(date, durationMinutes);

    if (date < workStart || date >= workEnd) {
      throw new BadRequestException(
        "O agendamento deve iniciar entre 08:00 e 17:30",
      );
    }

    if (appointmentEnd > workEnd) {
      throw new BadRequestException(
        "O exame termina fora do horário comercial (08:00 às 17:30)",
      );
    }
  }

  private async checkConflict(
    userId: number,
    scheduledAt: string | Date,
    durationMinutes: number,
    excludeId?: number,
  ): Promise<void> {
    const start =
      typeof scheduledAt === "string" ? parseISO(scheduledAt) : scheduledAt;

    const end = addMinutes(start, durationMinutes);

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.exam", "exam")
      .where("appointment.user_id = :userId", { userId })
      .andWhere("appointment.scheduled_at BETWEEN :dayStart AND :dayEnd", {
        dayStart: startOfDay(start),
        dayEnd: endOfDay(start),
      })
      .andWhere("appointment.status != :cancelled", { cancelled: "cancelled" });

    if (excludeId) {
      queryBuilder.andWhere("appointment.appointment_id != :excludeId", {
        excludeId,
      });
    }

    const existingAppointments = await queryBuilder.getMany();

    for (const existing of existingAppointments) {
      const existingStart = existing.scheduled_at;

      const existingDuration = this.getExamDurationMinutes(
        existing.exam?.duration_minutes,
      );

      const existingEnd = addMinutes(existingStart, existingDuration);

      const hasOverlap = start < existingEnd && existingStart < end;

      if (hasOverlap) {
        throw new ConflictException(
          "Você já possui um agendamento que conflita com este horário",
        );
      }
    }
  }

  async create(
    userId: number,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const exam = await this.examsService.findOne(createAppointmentDto.exam_id);
    const durationMinutes = this.getExamDurationMinutes(exam.duration_minutes);

    this.validateNotInPast(createAppointmentDto.scheduled_at);

    this.validateBusinessHours(
      createAppointmentDto.scheduled_at,
      durationMinutes,
    );

    await this.checkConflict(
      userId,
      createAppointmentDto.scheduled_at,
      durationMinutes,
    );

    const appointment = this.appointmentRepository.create({
      user_id: userId,
      exam_id: createAppointmentDto.exam_id,
      scheduled_at: parseISO(createAppointmentDto.scheduled_at),
      notes: createAppointmentDto.notes,
    });

    const saved = await this.appointmentRepository.save(appointment);
    await this.cacheManager.clear();
    return saved;
  }

  async findAllByUser(
    userId: number,
    pageOptionsDto: AppointmentPageOptionsDto,
  ): Promise<PageDto<Appointment>> {
    const cacheKey = `appointments:user:${userId}:status:${pageOptionsDto.status ?? "all"}:page:${pageOptionsDto.page}:take:${pageOptionsDto.take}:order:${pageOptionsDto.order}`;

    const cached = await this.cacheManager.get<PageDto<Appointment>>(cacheKey);

    if (cached) {
      return cached;
    }

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.exam", "exam")
      .where("appointment.user_id = :userId", { userId });

    if (pageOptionsDto.status) {
      queryBuilder.andWhere("appointment.status = :status", {
        status: pageOptionsDto.status,
      });
    }

    queryBuilder
      .orderBy("appointment.scheduled_at", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    const page = new PageDto(entities, pageMetaDto);
    await this.cacheManager.set(cacheKey, page, 5 * 60 * 1000);
    return page;
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
      const durationMinutes = this.getExamDurationMinutes(
        appointment.exam?.duration_minutes,
      );

      this.validateNotInPast(updateAppointmentDto.scheduled_at);

      this.validateBusinessHours(
        updateAppointmentDto.scheduled_at,
        durationMinutes,
      );

      await this.checkConflict(
        userId,
        updateAppointmentDto.scheduled_at,
        durationMinutes,
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

    const saved = await this.appointmentRepository.save(appointment);
    await this.cacheManager.clear();
    return saved;
  }
}
