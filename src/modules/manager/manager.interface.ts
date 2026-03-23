export interface ICreateManagerReq {
  brandName?: string;
  phone?: string;
  roleId: number;
  login?: string;
  password?: string;
}

export interface IUpdateManagerReq {
  brandName?: string;
  phone?: string;
  photo?: string;
  roleId?: number;
}
