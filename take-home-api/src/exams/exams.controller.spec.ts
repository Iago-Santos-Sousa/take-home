import { Test, TestingModule } from "@nestjs/testing";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Reflector } from "@nestjs/core";
import { ExamsController } from "./exams.controller";
import { ExamsService } from "./exams.service";

describe("ExamsController", () => {
  let controller: ExamsController;

  const examsServiceMock = {
    findOne: jest.fn(),
  } as unknown as ExamsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamsController],
      providers: [
        { provide: ExamsService, useValue: examsServiceMock },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
        { provide: Reflector, useValue: { get: jest.fn() } },
      ],
    }).compile();

    controller = module.get<ExamsController>(ExamsController);
  });

  it("should return exam details", async () => {
    const exam = { exam_id: 1, name: "Hemograma" };
    (examsServiceMock.findOne as jest.Mock).mockResolvedValue(exam);

    const result = await controller.findOne(1);

    expect(examsServiceMock.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: "Exam found", data: exam });
  });
});
