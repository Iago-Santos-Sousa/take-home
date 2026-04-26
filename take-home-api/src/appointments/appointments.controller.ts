import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { CurrentUser } from "../auth/current-user.decorator";
import { CurrentUserDto } from "../auth/current-user.dto";
import {
  CreateAppointmentDocs,
  GetAppointmentsDocs,
  UpdateAppointmentDocs,
} from "./appointments.docs";
import { AppointmentPageOptionsDto } from "./dto/appointment-page-options.dto";

@ApiTags("Appointments")
@ApiBearerAuth()
@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @CreateAppointmentDocs()
  async create(
    @CurrentUser() user: CurrentUserDto,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    const appointment = await this.appointmentsService.create(
      user.sub,
      createAppointmentDto,
    );

    return { message: "Appointment created successfully", data: appointment };
  }

  @Get()
  @GetAppointmentsDocs()
  async findAll(
    @CurrentUser() user: CurrentUserDto,
    @Query() pageOptionsDto: AppointmentPageOptionsDto,
  ) {
    const appointments = await this.appointmentsService.findAllByUser(
      user.sub,
      pageOptionsDto,
    );

    return {
      message: "Appointments retrieved successfully",
      data: appointments,
    };
  }

  @Patch(":id")
  @UpdateAppointmentDocs()
  async update(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    const appointment = await this.appointmentsService.update(
      id,
      user.sub,
      updateAppointmentDto,
    );

    return { message: "Appointment updated successfully", data: appointment };
  }
}
