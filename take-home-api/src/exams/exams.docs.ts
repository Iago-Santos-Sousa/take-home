import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { CreateExamDto } from "./dto/create-exam.dto";
import { Exam } from "./entities/exam.entity";

export const CreateExamDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: "Create an exam (Admin only)" }),
    ApiBody({ type: CreateExamDto }),
    ApiCreatedResponse({
      description: "Exam created successfully",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Exam created successfully" },
          data: { $ref: "#/components/schemas/Exam" },
        },
      },
    }),
  );
};

export const GetAllExamsDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: "List all active exams with search and pagination",
      security: [],
    }),
    ApiQuery({
      name: "search",
      required: false,
      description: "Filter exams by name (case-insensitive)",
      example: "Hemograma",
    }),
    ApiQuery({ name: "page", required: false, type: Number, example: 1 }),
    ApiQuery({ name: "take", required: false, type: Number, example: 10 }),
    ApiOkResponse({
      description: "Paginated list of exams",
      schema: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Exam" },
          },
          meta: {
            type: "object",
            properties: {
              page: { type: "number" },
              take: { type: "number" },
              itemCount: { type: "number" },
              pageCount: { type: "number" },
              hasPreviousPage: { type: "boolean" },
              hasNextPage: { type: "boolean" },
            },
          },
        },
      },
    }),
  );
};

export const GetExamByIdDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: "Get exam details by ID", security: [] }),
    ApiParam({ name: "id", type: Number, example: 1 }),
    ApiOkResponse({
      description: "Exam found",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Exam found" },
          data: { $ref: "#/components/schemas/Exam" },
        },
      },
    }),
  );
};

export const UpdateExamDocs = () => {
  return applyDecorators(
    ApiOperation({ summary: "Update an exam (Admin only)" }),
    ApiParam({ name: "id", type: Number, example: 1 }),
    ApiOkResponse({
      description: "Exam updated successfully",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Exam updated successfully" },
          data: { $ref: "#/components/schemas/Exam" },
        },
      },
    }),
  );
};
