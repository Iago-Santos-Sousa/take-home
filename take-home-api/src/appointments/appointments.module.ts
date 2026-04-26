import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentsService } from "./appointments.service";
import { AppointmentsController } from "./appointments.controller";
import { Appointment } from "./entities/appointment.entity";
import { ExamsModule } from "../exams/exams.module";
import { AppointmentsRepository } from "./repositories/appointments.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), ExamsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepository],
})
export class AppointmentsModule {}
