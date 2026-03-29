import { UserRole } from 'src/shared/types/enums';

export interface ITelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface ILoginReq {
  login: string;
  password: string;
}

export interface ILoginRes {
  id: number;
  login: string;
  role: UserRole;
  accessToken: string;
  refreshToken?: string;
}

export interface ITokenPayload {
  sub: number;
  role: UserRole;
}

export interface RequestUser {
  sub: number;
  role: UserRole;
  permissions: Set<string>;
}

export interface ILogoutReq {
  userId: number;
}

export interface InitSignupReq {
  telegramId: string;
  language: string;
  phone: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface IVerifyCodeReq {
  telegramId: string;
  code: string;
}

export interface IGetProfileReq {
  sub: number;
}
