export interface ErrorObject {
  errId: number;
  message: string;
}
export interface HttpResponse<T = any> {
  error?: ErrorObject | null;
  data: T;
}
export interface ServerResponse<T = any> {
  errId?: number | null;
  data: T | null;
}
export interface Success {
  success: boolean;
}
export interface ReqId {
  id: number;
  initiatorId?: number;
}
export interface Pagination {
  offset: number;
  limit: number;
}
