import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class TelegramGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const initData = request.headers['initData'] || request.headers['initdata'];

    if (!initData) throw new UnauthorizedException();

    const user = this.authService.validateInitData(initData);
    request.user = user;
    return true;
  }
}
