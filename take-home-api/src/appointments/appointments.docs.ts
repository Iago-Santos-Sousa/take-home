import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";

export const CreateAppointmentDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Create an appointment for the authenticated user",
    }),
    ApiBody({ type: CreateAppointmentDto }),
    ApiCreatedResponse({
      description: "Appointment created successfully",
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Appointment created successfully",
          },
          data: { $ref: "#/components/schemas/Appointment" },
        },
      },
    }),
  );
};

export const GetAppointmentsDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: "List all appointments for the authenticated user",
    }),
    ApiOkResponse({
      description: "Appointments retrieved successfully",
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Appointments retrieved successfully",
          },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Appointment" },
          },
        },
      },
    }),
  );
};

export const UpdateAppointmentDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: "Update an appointment (owner only)" }),
    ApiParam({ name: "id", type: Number, example: 1 }),
    ApiOkResponse({
      description: "Appointment updated successfully",
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Appointment updated successfully",
          },
          data: { $ref: "#/components/schemas/Appointment" },
        },
      },
    }),
  );
};
