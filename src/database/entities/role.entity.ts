import { Column, Entity } from 'typeorm';
import { GeneralEntity } from './general';

@Entity({ name: 'roles' })
export class RoleEntity extends GeneralEntity {
  @Column('varchar', { name: 'name', length: 255 })
  name: string;
}
