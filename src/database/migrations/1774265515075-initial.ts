import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1774265515075 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. users
    await queryRunner.query(`
      CREATE TABLE users (
        id          SERIAL PRIMARY KEY,
        fn          VARCHAR(200),
        ln          VARCHAR(200),
        telegram_id VARCHAR(256),
        user_type   SMALLINT NOT NULL,
        gender_type SMALLINT,
        is_active   BOOLEAN NOT NULL DEFAULT true,
        language_code VARCHAR(10),
        created_at  TIMESTAMP NOT NULL DEFAULT now(),
        updated_at  TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at  TIMESTAMP
      )
    `);

    // 2. roles
    await queryRunner.query(`
      CREATE TABLE roles (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP
      )
    `);

    // 3. attachments (managers va customers dan oldin — FK uchun)
    await queryRunner.query(`
      CREATE TABLE attachments (
        id          SERIAL PRIMARY KEY,
        key         VARCHAR(1024) NOT NULL,
        orig_name   VARCHAR(1024) NOT NULL,
        size        FLOAT NOT NULL,
        target_id   INTEGER NOT NULL,
        target_type SMALLINT NOT NULL,
        created_at  TIMESTAMP NOT NULL DEFAULT now(),
        updated_at  TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at  TIMESTAMP
      )
    `);

    // 4. managers
    await queryRunner.query(`
      CREATE TABLE managers (
        id           SERIAL PRIMARY KEY,
        login        VARCHAR(100) UNIQUE,
        password     VARCHAR(500),
        invite_code  VARCHAR(500),
        is_verfied   BOOLEAN NOT NULL DEFAULT false,
        bn           VARCHAR(255),
        phone        VARCHAR(100),
        photo        VARCHAR(500),
        is_superadmin BOOLEAN NOT NULL DEFAULT true,
        role_id      INTEGER REFERENCES roles(id) ON DELETE SET NULL,
        user_id      INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL,
        created_at   TIMESTAMP NOT NULL DEFAULT now(),
        updated_at   TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at   TIMESTAMP
      )
    `);

    // 5. customers
    await queryRunner.query(`
      CREATE TABLE customers (
        id         SERIAL PRIMARY KEY,
        ln         VARCHAR(200) NOT NULL,
        birth_date DATE,
        phone      VARCHAR(100),
        avatar_id  INTEGER UNIQUE REFERENCES attachments(id) ON DELETE SET NULL,
        user_id    INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS customers`);
    await queryRunner.query(`DROP TABLE IF EXISTS managers`);
    await queryRunner.query(`DROP TABLE IF EXISTS attachments`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
