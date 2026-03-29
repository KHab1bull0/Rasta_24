export interface ErrorObject {
  errId: number;
  message: string;
}

export interface ApiResponse<T = null> {
  data?: T | null;
  errId?: number | null;
  error?: ErrorObject | null;
}

export interface ISuccess {
  success: boolean;
}

export interface IReqId {
  id: number;
  initiatorId?: number;
}

export interface IPagination {
  offset: number;
  limit: number;
}
