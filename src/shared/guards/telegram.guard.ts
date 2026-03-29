import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class TelegramGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const initData = req.headers['x-telegram-init-data'];
    if (!initData) {
      throw new UnauthorizedException("Telegram initData yo'q");
    }

    if (!this.verify(initData)) {
      throw new UnauthorizedException('Telegram initData yaroqsiz');
    }

    req.telegramUser = this.parse(initData);
    return true;
  }

  private verify(initData: string): boolean {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return false;

    params.delete('hash');

    const checkString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');

    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(this.configService.get<string>('BOT_TOKEN'))
      .digest();

    const expected = crypto
      .createHmac('sha256', secret)
      .update(checkString)
      .digest('hex');

    return expected === hash;
  }

  private parse(initData: string): Record<string, unknown> {
    const params = new URLSearchParams(initData);
    return JSON.parse(params.get('user'));
  }
}
