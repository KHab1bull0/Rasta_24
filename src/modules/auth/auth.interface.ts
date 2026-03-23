export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface LoginReq {
  login: string;
  password: string;
}
export interface LoginRes {
  id: number;
  login: string;
  roleId?: number;
  roleName?: string;
  phone?: string;
  photo?: string;
  accessToken: string;
  refreshToken?: string;
}
export interface TokenPayload {
  userId: number;
  roleId: number;
  sessionId?: string;
}
export interface LogoutReq {
  fcmToken?: string;
  userId: number;
  sessionId: string;
}
