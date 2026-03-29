export interface IFindByTelegramIdReq {
  telegramId: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  telegramId: string;
  isActive: boolean;
}
