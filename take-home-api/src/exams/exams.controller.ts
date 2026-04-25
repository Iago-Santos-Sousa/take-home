import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import { ExamsService } from "./exams.service";
import { CreateExamDto } from "./dto/create-exam.dto";
import { UpdateExamDto } from "./dto/update-exam.dto";
import { ExamPageOptionsDto } from "./dto/exam-page-options.dto";
import { Roles } from "@/common/decorators/roles.decorator";
import { Public } from "@/common/decorators/skipAuth.decorator";
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
  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000)
  @GetAllExamsDocs()
  async findAll(@Query() pageOptionsDto: ExamPageOptionsDto) {
    return this.examsService.findAll(pageOptionsDto);
  }

  @Get(":id")
  @Public()
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
