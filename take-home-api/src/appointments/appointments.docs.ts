import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
        example: {
          message: "Appointment created successfully",
          data: {
            appointment_id: 1,
            user_id: 2,
            exam_id: 1,
            scheduled_at: "2026-05-01T14:00:00.000Z",
            status: "pending",
            notes: "Paciente com historico de diabetes",
            created_at: "2026-04-26T12:00:00.000Z",
            updated_at: "2026-04-26T12:00:00.000Z",
            exam: {
              exam_id: 1,
              name: "Hemograma Completo",
            },
          },
        },
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
    ApiQuery({ name: "page", required: false, example: 1 }),
    ApiQuery({ name: "take", required: false, example: 10 }),
    ApiQuery({ name: "order", required: false, enum: ["ASC", "DESC"] }),
    ApiQuery({
      name: "status",
      required: false,
      enum: ["pending", "confirmed", "cancelled"],
    }),
    ApiOkResponse({
      description: "Appointments retrieved successfully",
      schema: {
        type: "object",
        example: {
          message: "Appointments retrieved successfully",
          data: {
            data: [
              {
                appointment_id: 1,
                user_id: 2,
                exam_id: 1,
                scheduled_at: "2026-05-01T14:00:00.000Z",
                status: "pending",
                notes: "Paciente com historico de diabetes",
                created_at: "2026-04-26T12:00:00.000Z",
                updated_at: "2026-04-26T12:00:00.000Z",
                exam: {
                  exam_id: 1,
                  name: "Hemograma Completo",
                },
              },
            ],
            meta: {
              page: 1,
              take: 10,
              itemCount: 1,
              pageCount: 1,
              hasPreviousPage: false,
              hasNextPage: false,
            },
          },
        },
        properties: {
          message: {
            type: "string",
            example: "Appointments retrieved successfully",
          },
          data: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: { $ref: "#/components/schemas/Appointment" },
              },
              meta: {
                type: "object",
                properties: {
                  page: { type: "number", example: 1 },
                  take: { type: "number", example: 10 },
                  itemCount: { type: "number", example: 23 },
                  pageCount: { type: "number", example: 3 },
                  hasPreviousPage: { type: "boolean", example: false },
                  hasNextPage: { type: "boolean", example: true },
                },
              },
            },
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
        example: {
          message: "Appointment updated successfully",
          data: {
            appointment_id: 1,
            user_id: 2,
            exam_id: 1,
            scheduled_at: "2026-05-01T15:00:00.000Z",
            status: "confirmed",
            notes: "Horario ajustado",
            created_at: "2026-04-26T12:00:00.000Z",
            updated_at: "2026-04-26T12:20:00.000Z",
            exam: {
              exam_id: 1,
              name: "Hemograma Completo",
            },
          },
        },
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
