import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ExamsService } from "./exams.service";
import { CreateExamDto } from "./dto/create-exam.dto";
import { UpdateExamDto } from "./dto/update-exam.dto";
import { ExamPageOptionsDto } from "./dto/exam-page-options.dto";
import { Roles } from "@/common/decorators/roles.decorator";
import { UserRole } from "@/utils/enums";
import {
  CreateExamDocs,
  GetAllExamsDocs,
  GetExamByIdDocs,
  UpdateExamDocs,
} from "./exams.docs";

@ApiTags("Exams")
@ApiBearerAuth()
@Controller("exams")
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @CreateExamDocs()
  async create(@Body() createExamDto: CreateExamDto) {
    const exam = await this.examsService.create(createExamDto);
    return { message: "Exam created successfully", data: exam };
  }

  @Get()
  @GetAllExamsDocs()
  async findAll(@Query() pageOptionsDto: ExamPageOptionsDto) {
    return this.examsService.findAll(pageOptionsDto);
  }

  @Get(":id")
  @GetExamByIdDocs()
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const exam = await this.examsService.findOne(id);
    return { message: "Exam found", data: exam };
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @UpdateExamDocs()
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateExamDto: UpdateExamDto,
  ) {
    const exam = await this.examsService.update(id, updateExamDto);
    return { message: "Exam updated successfully", data: exam };
  }
}
