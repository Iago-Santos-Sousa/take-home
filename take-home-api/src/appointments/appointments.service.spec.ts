import { Test, TestingModule } from "@nestjs/testing";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { BadRequestException, ConflictException } from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";
import { AppointmentsRepository } from "./repositories/appointments.repository";
import { ExamsService } from "../exams/exams.service";

describe("AppointmentsService", () => {
  let service: AppointmentsService;

  const repositoryMock = {
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  } as unknown as AppointmentsRepository;

  const examsServiceMock = {
    findOne: jest.fn(),
  } as unknown as ExamsService;

  const cacheMock = {
    clear: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: AppointmentsRepository, useValue: repositoryMock },
        { provide: ExamsService, useValue: examsServiceMock },
        { provide: CACHE_MANAGER, useValue: cacheMock },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it("should block appointment outside business hours", async () => {
    (examsServiceMock.findOne as jest.Mock).mockResolvedValue({
      exam_id: 1,
      duration_minutes: 60,
    });

    await expect(
      service.create(1, {
        exam_id: 1,
        scheduled_at: "2030-01-10T22:00:00.000Z",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should block overlapping appointments", async () => {
    const qb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([
        {
          appointment_id: 2,
          scheduled_at: new Date("2030-01-10T15:00:00.000Z"),
          exam: { duration_minutes: 60 },
        },
      ]),
    };

    (examsServiceMock.findOne as jest.Mock).mockResolvedValue({
      exam_id: 1,
      duration_minutes: 45,
    });

    repositoryMock.createQueryBuilder = jest.fn().mockReturnValue(qb);

    await expect(
      service.create(1, {
        exam_id: 1,
        scheduled_at: "2030-01-10T15:30:00.000Z",
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
