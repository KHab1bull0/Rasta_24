import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleToUsers1774786298579 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // UserRole enum tipini yaratish
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE user_role_enum AS ENUM ('superadmin', 'baker', 'customer');
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);

    // role ustunini qo'shish
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role user_role_enum
    `);

    // Customer userlarni ko'chirish (user_type = 2)
    await queryRunner.query(`
      UPDATE users
      SET role = 'customer'
      WHERE user_type = 2
    `);

    // Baker va superadmin — managers jadvalidan aniqlanadi
    await queryRunner.query(`
      UPDATE users u
      SET role = CASE
        WHEN m.is_superadmin = true THEN 'superadmin'
        ELSE 'baker'
      END
      FROM managers m
      WHERE m.user_id = u.id
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS role`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum`);
  }
}
