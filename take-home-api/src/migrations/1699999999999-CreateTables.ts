import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1699999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "user_id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(100) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "role" VARCHAR(20) NOT NULL,
        "refresh_token" VARCHAR DEFAULT '',
        "reset_token" VARCHAR(255) UNIQUE,
        "reset_token_expiry" BIGINT,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "exam" (
        "exam_id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "preparation_instructions" TEXT,
        "duration_minutes" INT,
        "price" DECIMAL(10,2),
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "appointment" (
        "appointment_id" SERIAL PRIMARY KEY,
        "user_id" INT NOT NULL,
        "exam_id" INT NOT NULL,
        "scheduled_at" TIMESTAMPTZ NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
        "notes" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "fk_appointment_user" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE,
        CONSTRAINT "fk_appointment_exam" FOREIGN KEY ("exam_id") REFERENCES "exam"("exam_id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_appointment_user_id" ON "appointment"("user_id");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_appointment_exam_id" ON "appointment"("exam_id");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_appointment_scheduled_at" ON "appointment"("scheduled_at");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_appointment_scheduled_at";`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_appointment_exam_id";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_appointment_user_id";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "appointment";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "exam";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user";`);
  }
}
