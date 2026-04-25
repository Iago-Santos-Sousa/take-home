import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Appointment } from "../entities/appointment.entity";

@Injectable()
export class AppointmentsRepository extends Repository<Appointment> {
  constructor(private dataSource: DataSource) {
    super(Appointment, dataSource.createEntityManager());
  }
}
