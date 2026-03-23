import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { GeneralEntity } from './general';
import { UserEntity } from './user.entity';
import { AttachmentEntity } from './attachment.entity';

@Entity({ name: 'customers' })
export class CustomerEntity extends GeneralEntity {
  @Column('varchar', { name: 'ln', length: 200 })
  username: string;

  @Column('date', { name: 'birth_date', nullable: true })
  birthDate: Date;

  @Column('varchar', { name: 'phone', length: 100, nullable: true })
  phone?: string;

  @OneToOne(() => AttachmentEntity, { nullable: true })
  @JoinColumn({ name: 'avatar_id' })
  avatar: AttachmentEntity;

  @OneToOne(() => UserEntity, { nullable: true })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity;
}
