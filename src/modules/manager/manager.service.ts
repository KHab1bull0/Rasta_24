import { Injectable } from '@nestjs/common';
import { HttpResponse } from 'src/shared/types/interfaces';
import { generateInviteCode, hashPassword, setResult } from 'src/shared/helper';
import { ManagerEntity } from 'src/database/entities/manager.entity';
import { RoleEntity } from 'src/database/entities/role.entity';
import { MyError } from 'src/shared/errors';
import { ICreateManagerReq, IUpdateManagerReq } from './manager.interface';

@Injectable()
export class ManagerService {
  async create(data: ICreateManagerReq): Promise<HttpResponse> {
    const role = await RoleEntity.findOneBy({ id: data.roleId });
    if (!role) return setResult(null, MyError.ROLE_NOT_FOUND.errId);

    const manager = ManagerEntity.create({
      brandName: data.brandName,
      phone: data.phone,
      inviteCode: generateInviteCode(),
      isSuperadmin: false,
      role,
    });

    if (data.login) manager.login = data.login;
    if (data.password) manager.password = await hashPassword(data.password);

    await manager.save();
    return setResult(manager, null);
  }

  async findAll(): Promise<HttpResponse> {
    const managers = await ManagerEntity.find({
      relations: { role: true, user: true },
      order: { createdAt: 'DESC' },
    });
    return setResult(managers, null);
  }

  async findOne(id: number): Promise<HttpResponse> {
    const manager = await ManagerEntity.findOne({
      where: { id },
      relations: { role: true, user: true },
    });
    if (!manager) return setResult(null, MyError.USER_NOT_FOUND.errId);
    return setResult(manager, null);
  }

  async update(id: number, data: IUpdateManagerReq): Promise<HttpResponse> {
    const manager = await ManagerEntity.findOneBy({ id });
    if (!manager) return setResult(null, MyError.USER_NOT_FOUND.errId);

    if (data.brandName !== undefined) manager.brandName = data.brandName;
    if (data.phone !== undefined) manager.phone = data.phone;
    if (data.photo !== undefined) manager.photo = data.photo;

    if (data.roleId) {
      const role = await RoleEntity.findOneBy({ id: data.roleId });
      if (!role) return setResult(null, MyError.ROLE_NOT_FOUND.errId);
      manager.role = role;
    }

    await manager.save();
    return setResult(manager, null);
  }

  async remove(id: number): Promise<HttpResponse> {
    const manager = await ManagerEntity.findOneBy({ id });
    if (!manager) return setResult(null, MyError.USER_NOT_FOUND.errId);
    await manager.softRemove();
    return setResult({ success: true }, null);
  }
}
