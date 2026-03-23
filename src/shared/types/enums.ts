export enum AppMode {
  DEV = 'dev',
  TEST = 'test',
  PROD = 'prod',
}
export enum UserType {
  MANAGER = 1,
  CUSTOMER = 2,
}
export enum GenderTypes {
  MALE = 1,
  FEMALE = 2,
}
export enum AttachmentTargetType {
  PROFILE = 1,
  BRANCH,
}
export enum CloudflareFolders {
  PROFILE = 'profile',
  BRANCH = 'branch',
}
export const enum PostgresErrorCode {
  UNIQUE_VIOLATION = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
}
