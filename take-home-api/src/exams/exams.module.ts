import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExamsService } from "./exams.service";
import { ExamsController } from "./exams.controller";
import { Exam } from "./entities/exam.entity";
import { ExamRepository } from "./repositories/exam.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Exam])],
  controllers: [ExamsController],
  providers: [ExamsService, ExamRepository],
  exports: [ExamsService],
})
export class ExamsModule {}
