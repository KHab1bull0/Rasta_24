import { IRole } from '../role/role.interface';
import { IUser } from '../user/user.interface';

export interface ICreateManagerReq {
  brandName?: string;
  phone?: string;
  roleId: number;
  login?: string;
  password?: string;
}

export interface ICreateManagerRes {
  code?: string;
}

export interface IUpdateManagerReq {
  brandName?: string;
  phone?: string;
  photo?: string;
  roleId?: number;
}

export interface IManager {
  id: number;
  login?: string;
  inviteCode: string;
  isVerified: boolean;
  brandName?: string;
  phone?: string;
  photo?: string;
  isSuperadmin: boolean;
  role: IRole;
  user?: IUser | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
