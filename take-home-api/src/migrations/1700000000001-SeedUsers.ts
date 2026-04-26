import { scryptSync } from "crypto";
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUsers1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const luanaSalt = "luana2026";
    const gabrielSalt = "gabriel2026";

    const luanaPasswordHash = scryptSync("Luana@123", luanaSalt, 32).toString(
      "hex",
    );
    const gabrielPasswordHash = scryptSync(
      "Gabriel@123",
      gabrielSalt,
      32,
    ).toString("hex");

    await queryRunner.query(
      `
      INSERT INTO "user" ("name", "email", "password", "role")
      VALUES
        ('Luana Klein', 'luana.klein@takehome.com', '${luanaSalt}.${luanaPasswordHash}', 'user'),
        ('Gabriel Feitosa', 'gabriel.feitosa@takehome.com', '${gabrielSalt}.${gabrielPasswordHash}', 'admin')
      ON CONFLICT ("email") DO NOTHING;
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      DELETE FROM "user"
      WHERE "email" IN ('luana.klein@takehome.com', 'gabriel.feitosa@takehome.com');
      `,
    );
  }
}
