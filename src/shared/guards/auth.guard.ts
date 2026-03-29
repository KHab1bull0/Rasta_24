import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLE_PERMISSIONS } from '../constants/roles.constants';
import { RequestUser } from 'src/modules/auth/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    const payload = await this.authService.validateToken(token);
    if (!payload) throw new UnauthorizedException();

    const reqUser: RequestUser = {
      sub: payload.sub,
      role: payload.role,
      permissions: new Set(ROLE_PERMISSIONS[payload.role] ?? []),
    };

    request['user'] = reqUser;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
