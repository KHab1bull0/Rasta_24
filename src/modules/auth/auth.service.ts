import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import {
  LoginReq,
  LoginRes,
  TelegramUser,
  TokenPayload,
} from './auth.interface';
import { HttpResponse, ServerResponse } from 'src/shared/types/interfaces';
import { ManagerEntity } from 'src/database/entities/manager.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { CustomerEntity } from 'src/database/entities/customer.entity';
import { comparePasswords, setResult } from 'src/shared/helper';
import { MyError } from 'src/shared/errors';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { UserType } from 'src/shared/types/enums';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(data: LoginReq): Promise<ServerResponse<LoginRes>> {
    const user = await ManagerEntity.findOne({
      where: {
        login: data.login,
      },
      relations: {
        role: true,
      },
    });

    const isMatched =
      user && (await comparePasswords(data.password, user.password));

    if (!user || !isMatched) {
      return { data: null, errId: MyError.INVALID_CREDENTIALS.errId };
    }
    const payload: TokenPayload = {
      userId: user.id,
      roleId: user.role.id,
    };

    const tokens = await this.generateToken(payload, true);
    if (!tokens) return { errId: MyError.BAD_REQUEST.errId, data: null };

    const response: LoginRes = {
      id: user.id,
      login: user.login,
      roleId: user.role.id,
      roleName: user.role.name,
      ...tokens,
    };

    return { data: response };
  }

  private async generateToken(
    data: TokenPayload,
    refresh: boolean = false,
  ): Promise<{ accessToken: string; refreshToken?: string } | null> {
    try {
      const accessExpiresIn = this.configService.get('auth.jwtExpirationTime');
      const accessSecret = this.configService.get('auth.jwtSecret');

      const accessToken = await this.jwtService.signAsync(data, {
        expiresIn: accessExpiresIn,
        secret: accessSecret,
      });

      if (!refresh) {
        return { accessToken };
      }

      const refreshExpiresIn = this.configService.get(
        'auth.jwtRefreshExpirationTime',
      );
      const refreshSecret = this.configService.get('auth.refreshSecret');

      const refreshToken = await this.jwtService.signAsync(data, {
        expiresIn: refreshExpiresIn,
        secret: refreshSecret,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('[generateToken]: ', error);
      return null;
    }
  }

  async validateToken(
    token: string,
    isRefresh: boolean = false,
  ): Promise<TokenPayload | null> {
    try {
      if (isRefresh) {
        const options: JwtVerifyOptions = {};

        options.secret = this.configService.get('auth.refreshSecret');

        return this.jwtService.verifyAsync<TokenPayload>(token, options);
      }

      return this.jwtService.verifyAsync<TokenPayload>(token);
    } catch (error) {
      this.logger.error('[validateToken]: ', error);
      return null;
    }
  }

  async initSignup(
    telegramUser: TelegramUser,
    phone: string,
  ): Promise<HttpResponse> {
    const existing = await UserEntity.findOne({
      where: { telegramId: String(telegramUser.id) },
    });

    if (existing) {
      const customer = await CustomerEntity.findOne({
        where: { user: { id: existing.id } },
        relations: { user: true },
      });
      return setResult({ user: existing, customer }, null);
    }

    const user = UserEntity.create({
      telegramId: String(telegramUser.id),
      firstName: telegramUser.first_name ?? null,
      lastName: telegramUser.last_name ?? null,
      languageCode: telegramUser.language_code ?? null,
      userType: UserType.CUSTOMER,
      isActive: true,
    });
    await user.save();

    const customer = CustomerEntity.create({
      username: telegramUser.username ?? '',
      phone,
      user,
    });
    await customer.save();

    return setResult({ user, customer }, null);
  }

  validateInitData(initData: string): any {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const dataCheckString = Array.from(urlParams.entries())
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n');

    const secretKey = createHmac('sha256', 'WebAppData')
      .update(this.configService.get('BOT_TOKEN'))
      .digest();

    const hmac = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (hmac !== hash) {
      throw new UnauthorizedException('Ma’lumotlar haqiqiy emas!');
    }

    return JSON.parse(urlParams.get('user'));
  }
}
