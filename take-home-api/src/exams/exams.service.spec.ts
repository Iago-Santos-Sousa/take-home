import { Test, TestingModule } from "@nestjs/testing";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import { ExamsService } from "./exams.service";
import { ExamRepository } from "./repositories/exam.repository";
import { Exam } from "./entities/exam.entity";

describe("ExamsService", () => {
  let service: ExamsService;

  const examRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  } as unknown as ExamRepository;

  const cacheMock = {
    clear: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamsService,
        { provide: ExamRepository, useValue: examRepositoryMock },
        { provide: CACHE_MANAGER, useValue: cacheMock },
      ],
    }).compile();

    service = module.get<ExamsService>(ExamsService);
  });

  it("should create exam and clear cache", async () => {
    const created = { name: "Hemograma", is_active: true } as Exam;
    const saved = { exam_id: 1, name: "Hemograma", is_active: true } as Exam;

    examRepositoryMock.create = jest.fn().mockReturnValue(created);
    examRepositoryMock.save = jest.fn().mockResolvedValue(saved);

    const result = await service.create({ name: "Hemograma" });

    expect(examRepositoryMock.create).toHaveBeenCalledWith({
      name: "Hemograma",
      is_active: true,
    });
    expect(examRepositoryMock.save).toHaveBeenCalledWith(created);
    expect(cacheMock.clear).toHaveBeenCalled();
    expect(result).toEqual(saved);
  });

  it("should throw when exam is not found", async () => {
    examRepositoryMock.findOne = jest.fn().mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
