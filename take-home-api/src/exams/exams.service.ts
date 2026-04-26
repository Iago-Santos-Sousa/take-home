import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Exam } from "./entities/exam.entity";
import { CreateExamDto } from "./dto/create-exam.dto";
import { UpdateExamDto } from "./dto/update-exam.dto";
import { ExamPageOptionsDto } from "./dto/exam-page-options.dto";
import { PageDto, PageMetaDto } from "@/common/dtos";
import { ExamRepository } from "./repositories/exam.repository";
@Injectable()
export class ExamsService {
  constructor(
    private readonly examRepository: ExamRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const exam = this.examRepository.create({
      ...createExamDto,
      is_active: createExamDto.is_active ?? true,
    });

    const saved = await this.examRepository.save(exam);
    await this.cacheManager.clear();
    return saved;
  }

  async findAll(pageOptionsDto: ExamPageOptionsDto): Promise<PageDto<Exam>> {
    const queryBuilder = this.examRepository
      .createQueryBuilder("exam")
      .where("exam.is_active = :is_active", { is_active: true });

    if (pageOptionsDto.search) {
      queryBuilder.andWhere("exam.name ILIKE :search", {
        search: `%${pageOptionsDto.search}%`,
      });
    }

    queryBuilder
      .orderBy("exam.name", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(exam_id: number): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { exam_id, is_active: true },
    });

    if (!exam) {
      throw new NotFoundException(`Exame com ID ${exam_id} não encontrado.`);
    }

    return exam;
  }

  async update(exam_id: number, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(exam_id);

    Object.keys(updateExamDto).forEach((key) => {
      if (
        updateExamDto[key] === undefined ||
        !(key in updateExamDto) ||
        updateExamDto[key] === null ||
        (typeof updateExamDto[key] === "string" &&
          updateExamDto[key].trim() === "")
      ) {
        updateExamDto[key] = null;
      }
    });

    Object.assign(exam, updateExamDto);
    const saved = await this.examRepository.save(exam);
    await this.cacheManager.clear();
    return saved;
  }
}
