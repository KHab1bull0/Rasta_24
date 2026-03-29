import { Column, Entity, OneToOne } from 'typeorm';
import { GeneralEntity } from './general';
import { GenderTypes, UserRole, UserType } from 'src/shared/types/enums';
import { ManagerEntity } from './manager.entity';
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'users' })
export class UserEntity extends GeneralEntity {
  @Column('varchar', { name: 'fn', length: 200, nullable: true })
  firstName: string;

  @Column('varchar', { name: 'ln', length: 200, nullable: true })
  lastName: string;

  @Column('varchar', { name: 'telegram_id', nullable: true })
  telegramId: string;

  @Column('smallint', { name: 'user_type', nullable: true })
  userType: UserType;

  @Column({
    type: 'enum',
    enum: UserRole,
    name: 'role',
    nullable: true,
  })
  role: UserRole;

  @Column('smallint', {
    name: 'gender_type',
    nullable: true,
  })
  genderType?: GenderTypes;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('varchar', { name: 'language_code', nullable: true })
  languageCode: string;

  @OneToOne(() => ManagerEntity, (manager) => manager.user)
  manager: ManagerEntity;

  @OneToOne(() => CustomerEntity, (customer) => customer.user)
  customer: CustomerEntity;
}
