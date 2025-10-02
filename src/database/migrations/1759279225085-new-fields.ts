import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewFields1759279225085 implements MigrationInterface {
  name = 'NewFields1759279225085';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" ADD "description" character varying(800)`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "cover_image" character varying(800)`);
    await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "cover_image" TYPE varchar(800) USING cover_image::varchar(800);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "cover_image" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "cover_image"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "description"`);
  }
}
