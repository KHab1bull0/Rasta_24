import { Injectable, Logger } from '@nestjs/common';
import { hashPassword, rollbackActiveTransaction } from 'src/shared/helper';
import { DataSource, In, QueryRunner } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import { ManagerEntity } from '../entities/manager.entity';
import { UserType } from 'src/shared/types/enums';

@Injectable()
export class SeedService {
  private logger = new Logger(SeedService.name);

  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const roles = await this.createRoles(queryRunner);
      this.logger.log('Roles seeded');

      await this.createSuperadmin(queryRunner, roles['superadmin']);
      this.logger.log('Superadmin seeded');

      await queryRunner.commitTransaction();
      this.logger.log('Seeding completed successfully');
    } catch (e) {
      this.logger.error('Seeding failed', e);
    } finally {
      await rollbackActiveTransaction(queryRunner);
    }
  }

  private async createRoles(
    queryRunner: QueryRunner,
  ): Promise<Record<string, RoleEntity>> {
    const roleNames = ['superadmin'];

    const existing = await queryRunner.manager.find(RoleEntity, {
      where: { name: In(roleNames) },
    });
    const existingNames = existing.map((r) => r.name);

    const toCreate = roleNames
      .filter((name) => !existingNames.includes(name))
      .map((name) => queryRunner.manager.create(RoleEntity, { name }));

    if (toCreate.length > 0) {
      await queryRunner.manager.save(RoleEntity, toCreate);
    }

    const allRoles = await queryRunner.manager.find(RoleEntity, {
      where: { name: In(roleNames) },
    });

    return Object.fromEntries(allRoles.map((r) => [r.name, r]));
  }

  private async createSuperadmin(
    queryRunner: QueryRunner,
    role: RoleEntity,
  ): Promise<void> {
    const LOGIN = 'superadmin';

    const exists = await queryRunner.manager.findOneBy(ManagerEntity, {
      login: LOGIN,
    });
    if (exists) {
      this.logger.log('Superadmin already exists, skipping');
      return;
    }

    const user = queryRunner.manager.create(UserEntity, {
      firstName: 'Super',
      lastName: 'Admin',
      userType: UserType.MANAGER,
      isActive: true,
    });
    await queryRunner.manager.save(UserEntity, user);

    const manager = queryRunner.manager.create(ManagerEntity, {
      login: LOGIN,
      password: await hashPassword('admin123'),
      isSuperadmin: true,
      role,
      user,
    });
    await queryRunner.manager.save(ManagerEntity, manager);
  }
}
