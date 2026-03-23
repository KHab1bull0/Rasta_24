import { Injectable } from '@nestjs/common';
import { HttpResponse } from 'src/shared/types/interfaces';
import { setResult } from 'src/shared/helper';
import { RoleEntity } from 'src/database/entities/role.entity';
import { MyError } from 'src/shared/errors';

@Injectable()
export class RoleService {
  async create(name: string): Promise<HttpResponse> {
    const role = RoleEntity.create({ name });
    await role.save();
    return setResult(role, null);
  }

  async findAll(): Promise<HttpResponse> {
    const roles = await RoleEntity.find({ order: { id: 'ASC' } });
    return setResult(roles, null);
  }

  async findOne(id: number): Promise<HttpResponse> {
    const role = await RoleEntity.findOneBy({ id });
    if (!role) return setResult(null, MyError.ROLE_NOT_FOUND.errId);
    return setResult(role, null);
  }

  async update(id: number, name: string): Promise<HttpResponse> {
    const role = await RoleEntity.findOneBy({ id });
    if (!role) return setResult(null, MyError.ROLE_NOT_FOUND.errId);
    role.name = name;
    await role.save();
    return setResult(role, null);
  }

  async remove(id: number): Promise<HttpResponse> {
    const role = await RoleEntity.findOneBy({ id });
    if (!role) return setResult(null, MyError.ROLE_NOT_FOUND.errId);
    await role.softRemove();
    return setResult({ success: true }, null);
  }
}
