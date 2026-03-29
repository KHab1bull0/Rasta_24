import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiResponse } from '../types/interfaces';
import { setResult } from '../helper';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: ApiResponse) => {
        const http = context.switchToHttp();
        const res = http.getResponse<Response>();

        if (response?.errId) {
          res.status(HttpStatus.BAD_REQUEST);
          return setResult(null, response.errId);
        }

        return setResult(response.data, null);
      }),
      catchError((err) => {
        err.class = context.getClass().name;
        err.handler = context.getHandler().name;
        return throwError(() => err);
      }),
    );
  }
}
