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
