import { Injectable } from '@nestjs/common';
import { ApiResponse, IReqId, ISuccess } from 'src/shared/types/interfaces';
import { setResult } from 'src/shared/helper';
import { RoleEntity } from 'src/database/entities/role.entity';
import { MyError } from 'src/shared/errors';
import { IUpdateRoleReq } from './role.interface';

@Injectable()
export class RoleService {
  async create(name: string): Promise<ApiResponse<ISuccess>> {
    const role = RoleEntity.create({ name });
    await role.save();

    return { data: { success: true } };
  }

  async findAll(): Promise<ApiResponse<RoleEntity[]>> {
    const roles = await RoleEntity.find({ order: { id: 'ASC' } });

    return { data: roles };
  }

  async findOne(data: IReqId): Promise<ApiResponse<RoleEntity>> {
    const role = await RoleEntity.findOneBy({ id: data.id });
    if (!role) return setResult(null, MyError.ROLE_NOT_FOUND.errId);

    return { data: role };
  }

  async update(data: IUpdateRoleReq): Promise<ApiResponse<ISuccess>> {
    const role = await RoleEntity.findOneBy({ id: data.id });
    if (!role) return setResult(null, MyError.ROLE_NOT_FOUND.errId);

    role.name = data.name;
    await role.save();

    return { data: { success: true } };
  }

  async remove(data: IReqId): Promise<ApiResponse<ISuccess>> {
    const role = await RoleEntity.findOneBy({ id: data.id });
    if (!role) return setResult(null, MyError.ROLE_NOT_FOUND.errId);

    await role.softRemove();

    return { data: { success: true } };
  }
}
