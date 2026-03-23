import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { GeneralEntity } from './general';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'managers' })
export class ManagerEntity extends GeneralEntity {
  @Column('varchar', {
    name: 'login',
    length: 100,
    nullable: true,
    unique: true,
  })
  login?: string;

  @Column('varchar', { name: 'password', length: 500, nullable: true })
  password?: string;

  @Column('varchar', { name: 'invite_code', length: 500, nullable: true })
  inviteCode: string;

  @Column('boolean', { name: 'is_verfied', default: false })
  isVerified: boolean;

  @Column('varchar', { name: 'bn', nullable: true })
  brandName: string;

  @Column('varchar', { name: 'phone', length: 100, nullable: true })
  phone?: string;

  @Column('varchar', { name: 'photo', length: 500, nullable: true })
  photo?: string;

  @Column('boolean', { name: 'is_superadmin', default: true })
  isSuperadmin: boolean;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
  })
  role: RoleEntity;

  @OneToOne(() => UserEntity, { nullable: true })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity;
}
