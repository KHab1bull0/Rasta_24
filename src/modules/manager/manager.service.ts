import { Injectable } from '@nestjs/common';
import { ApiResponse, ISuccess } from 'src/shared/types/interfaces';
import { generateInviteCode, hashPassword, setResult } from 'src/shared/helper';
import { ManagerEntity } from 'src/database/entities/manager.entity';
import { RoleEntity } from 'src/database/entities/role.entity';
import { MyError } from 'src/shared/errors';
import {
  ICreateManagerReq,
  ICreateManagerRes,
  IUpdateManagerReq,
} from './manager.interface';

@Injectable()
export class ManagerService {
  async create(
    data: ICreateManagerReq,
  ): Promise<ApiResponse<ICreateManagerRes>> {
    const role = await RoleEntity.findOneBy({ id: data.roleId });
    if (!role) return setResult(null, MyError.ROLE_NOT_FOUND.errId);

    const code = generateInviteCode();

    const manager = ManagerEntity.create({
      brandName: data.brandName,
      phone: data.phone,
      inviteCode: code,
      isSuperadmin: false,
      role,
    });

    if (data.login) manager.login = data.login;
    if (data.password) manager.password = await hashPassword(data.password);

    await manager.save();

    return { data: { code } };
  }

  async findAll(): Promise<ApiResponse<ManagerEntity[]>> {
    const managers = await ManagerEntity.find({
      relations: { role: true, user: true },
      order: { createdAt: 'DESC' },
    });
    return { data: managers };
  }

  async findOne(id: number): Promise<ApiResponse<ManagerEntity>> {
    const manager = await ManagerEntity.findOne({
      where: { id },
      relations: { role: true, user: true },
    });
    if (!manager) return setResult(null, MyError.USER_NOT_FOUND.errId);

    return { data: manager };
  }

  async update(
    id: number,
    data: IUpdateManagerReq,
  ): Promise<ApiResponse<ISuccess>> {
    const manager = await ManagerEntity.findOneBy({ id });
    if (!manager) return setResult(null, MyError.USER_NOT_FOUND.errId);

    if (data.brandName !== undefined) manager.brandName = data.brandName;
    if (data.phone !== undefined) manager.phone = data.phone;
    if (data.photo !== undefined) manager.photo = data.photo;

    if (data.roleId) {
      const role = await RoleEntity.findOneBy({ id: data.roleId });
      if (!role) return { errId: MyError.ROLE_NOT_FOUND.errId };
      manager.role = role;
    }

    await manager.save();
    return { data: { success: true } };
  }

  async remove(id: number): Promise<ApiResponse<ISuccess>> {
    const manager = await ManagerEntity.findOneBy({ id });
    if (!manager) return setResult(null, MyError.USER_NOT_FOUND.errId);
    await manager.softRemove();

    return { data: { success: true } };
  }
}
