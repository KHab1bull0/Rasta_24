import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from 'src/modules/auth/auth.interface';

export const TokenData = createParamDecorator(
  (_: string, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
