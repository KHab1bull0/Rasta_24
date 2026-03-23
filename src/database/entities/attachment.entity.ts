import { AttachmentTargetType } from 'src/shared/types/enums';
import { Column, Entity } from 'typeorm';
import { GeneralEntity } from './general';

@Entity({ name: 'attachments' })
export class AttachmentEntity extends GeneralEntity {
  @Column('varchar', { name: 'key', length: 1024 })
  key: string;

  @Column('varchar', { name: 'orig_name', length: 1024 })
  origName: string;

  @Column('float', { name: 'size' })
  size: number;

  @Column('integer', { name: 'target_id' })
  targetId: number;

  @Column('smallint', { name: 'target_type' })
  targetType: AttachmentTargetType;
}
