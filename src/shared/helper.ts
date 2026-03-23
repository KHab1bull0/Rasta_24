import { QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MyError } from './errors';
import { HttpResponse } from './types/interfaces';

export async function rollbackActiveTransaction(
  queryRunner: QueryRunner,
): Promise<void> {
  if (queryRunner.isTransactionActive) {
    await queryRunner.rollbackTransaction();
  }

  await queryRunner.release();
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateInviteCode(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function setResult(data: any, errId: number | null): HttpResponse {
  if (errId) {
    const error = MyError.getErrorByErrId(errId);
    return {
      data: null,
      error: {
        errId: error.errId,
        message: data ?? error.message,
      },
    };
  }

  return { data, error: null };
}
