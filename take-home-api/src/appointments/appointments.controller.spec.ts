import { Test, TestingModule } from "@nestjs/testing";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";
import { Order } from "@/common/constants/order.constant";
import { AppointmentPageOptionsDto } from "./dto/appointment-page-options.dto";

describe("AppointmentsController", () => {
  let controller: AppointmentsController;

  const appointmentsServiceMock = {
    findAllByUser: jest.fn(),
  } as unknown as AppointmentsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        { provide: AppointmentsService, useValue: appointmentsServiceMock },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  it("should return paginated appointments", async () => {
    const pageResult = {
      data: [{ appointment_id: 1 }],
      meta: {
        page: 1,
        take: 10,
        itemCount: 1,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };

    (appointmentsServiceMock.findAllByUser as jest.Mock).mockResolvedValue(
      pageResult,
    );

    const pageOptions = Object.assign(new AppointmentPageOptionsDto(), {
      page: 1,
      take: 10,
      order: Order.ASC,
    });

    const result = await controller.findAll(
      { sub: 1, username: "john", email: "john@mail.com", roles: ["user"] },
      pageOptions,
    );

    expect(appointmentsServiceMock.findAllByUser).toHaveBeenCalledWith(1, {
      page: 1,
      take: 10,
      order: Order.ASC,
    });

    expect(result).toEqual({
      message: "Appointments retrieved successfully",
      data: pageResult,
    });
  });
});
