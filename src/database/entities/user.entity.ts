import { Column, Entity } from 'typeorm';
import { GeneralEntity } from './general';
import { GenderTypes, UserType } from 'src/shared/types/enums';

@Entity({ name: 'users' })
export class UserEntity extends GeneralEntity {
  @Column('varchar', { name: 'fn', length: 200, nullable: true })
  firstName: string;

  @Column('varchar', { name: 'ln', length: 200, nullable: true })
  lastName: string;

  @Column('varchar', { name: 'telegram_id', nullable: true })
  telegramId: string;

  @Column('smallint', { name: 'user_type' })
  userType: UserType;

  @Column('smallint', {
    name: 'gender_type',
    nullable: true,
  })
  genderType?: GenderTypes;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @Column('varchar', { name: 'language_code', nullable: true })
  languageCode: string;
}
