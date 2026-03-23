import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ForbiddenException,
  HttpStatus,
  Logger,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { MyError } from '../errors';
import { ThrottlerException } from '@nestjs/throttler';
import { setResult } from '../helper';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { ip, originalUrl } = request;

    const stack = exception.stack?.split('\n');

    const userCodeLine = stack
      ?.find((line) => line.includes('src/') && !line.includes('node_modules'))
      ?.trim();

    const match = userCodeLine?.match(/\((.*):(\d+):(\d+)\)$/);
    const lineNumber = match ? match[2] : null;
    const columnNumber = match ? match[3] : null;

    this.logger.error(
      `[${exception.class}#${exception.handler}#${lineNumber}:${columnNumber}] ${exception}`,
    );

    switch (exception.constructor) {
      case EntityNotFoundError: {
        const entityName = exception.message?.match(/(\w+Entity)\b/g)?.[0];
        return response
          .status(HttpStatus.BAD_REQUEST)
          .jsonp(setResult(null, MyError.getErrIdByEntity(entityName)));
      }
      case ThrottlerException: {
        this.logger.warn(
          `Rate limited. Url: [${originalUrl}], IP address: [${ip}] Error: [${exception.message}]`,
        );
        return response
          .status(HttpStatus.TOO_MANY_REQUESTS)
          .jsonp(setResult(null, MyError.TOO_MANY_REQUEST.errId));
      }
      case ForbiddenException: {
        this.logger.warn(
          `Forbidden exception. Url: [${originalUrl}], IP address: [${ip}]`,
        );
        return response
          .status(HttpStatus.FORBIDDEN)
          .jsonp(setResult(null, MyError.OPERATION_FORBIDDEN.errId));
      }
      case UnauthorizedException: {
        this.logger.warn(
          `Unauthorized exception. Url: [${originalUrl}], IP address: [${ip}]`,
        );
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .jsonp(setResult(null, MyError.UNAUTHORIZED_USER.errId));
      }
      case RequestTimeoutException: {
        return response
          .status(HttpStatus.REQUEST_TIMEOUT)
          .jsonp(setResult(null, MyError.REQUEST_TIMEOUT.errId));
      }
      case NotFoundException: {
        this.logger.warn(
          `NotFound exception. Url: [${originalUrl}], IP address: [${ip}]`,
        );
        return response
          .status(HttpStatus.NOT_FOUND)
          .jsonp(setResult(null, MyError.RESOURCE_NOT_FOUND.errId));
      }
      case BadRequestException: {
        const res = exception.getResponse();
        this.logger.error(res);
        return response
          .status(HttpStatus.BAD_REQUEST)
          .jsonp(setResult(res.message, MyError.BAD_REQUEST.errId));
      }
      case QueryFailedError: {
        const errorId = MyError.getErrorIdByCode(exception.code);
        this.logger.warn(
          `QueryFailedError exception. Url: [${originalUrl}], IP address: [${ip}]`,
        );
        return response
          .status(HttpStatus.BAD_REQUEST)
          .jsonp(setResult(null, errorId));
      }
      default: {
        this.logger.warn(
          `Internal Server error. Url: [${originalUrl}], IP address: [${ip}]. Error: [${exception.message}]`,
        );
        return response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .jsonp(setResult(null, MyError.SERVER_UNKNOWN_ERROR.errId));
      }
    }
  }
}
