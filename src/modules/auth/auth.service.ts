import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IGetProfileReq,
  ILoginReq,
  ILoginRes,
  InitSignupReq,
  ITokenPayload,
  ITelegramUser,
  IVerifyCodeReq,
} from './auth.interface';
import { ApiResponse, ISuccess } from 'src/shared/types/interfaces';
import { ManagerEntity } from 'src/database/entities/manager.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { CustomerEntity } from 'src/database/entities/customer.entity';
import { comparePasswords } from 'src/shared/helper';
import { MyError } from 'src/shared/errors';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { UserRole, UserType } from 'src/shared/types/enums';
import { IManager } from '../manager/manager.interface';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(data: ILoginReq): Promise<ApiResponse<ILoginRes>> {
    const manager = await ManagerEntity.findOne({
      where: { login: data.login },
    });

    const isMatched =
      manager && (await comparePasswords(data.password, manager.password));

    if (!manager || !isMatched) {
      return { errId: MyError.INVALID_CREDENTIALS.errId };
    }

    const role = manager.isSuperadmin ? UserRole.SUPERADMIN : UserRole.BAKER;

    const payload: ITokenPayload = {
      sub: manager.id,
      role,
    };

    const tokens = await this.generateToken(payload, true);
    if (!tokens) return { errId: MyError.BAD_REQUEST.errId };

    const response: ILoginRes = {
      id: manager.id,
      login: manager.login,
      role,
      ...tokens,
    };

    return { data: response };
  }

  generateToken(
    data: ITokenPayload,
    refresh: boolean = false,
  ): Promise<{ accessToken: string; refreshToken?: string } | null> {
    return this._signToken(data, refresh);
  }

  private async _signToken(
    data: ITokenPayload,
    refresh: boolean,
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
  ): Promise<ITokenPayload | null> {
    if (isRefresh) {
      const options: JwtVerifyOptions = {
        secret: this.configService.get('auth.refreshSecret'),
      };
      return this.jwtService.verifyAsync<ITokenPayload>(token, options);
    }

    return this.jwtService.verifyAsync<ITokenPayload>(token);
  }

  async findOrCreateTelegramUser(tgUser: ITelegramUser): Promise<UserEntity> {
    let user = await UserEntity.findOne({
      where: { telegramId: String(tgUser.id) },
    });

    if (!user) {
      user = UserEntity.create({
        telegramId: String(tgUser.id),
        firstName: tgUser.first_name ?? null,
        lastName: tgUser.last_name ?? null,
        languageCode: tgUser.language_code ?? null,
        role: UserRole.CUSTOMER,
        userType: UserType.CUSTOMER,
        isActive: true,
      });
      await user.save();

      const customer = CustomerEntity.create({
        username: tgUser.username ?? '',
        user,
      });
      await customer.save();
    }

    return user;
  }

  async telegramLogin(
    tgUser: ITelegramUser,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    const user = await this.findOrCreateTelegramUser(tgUser);

    const payload: ITokenPayload = {
      sub: user.id,
      role: user.role ?? UserRole.CUSTOMER,
    };

    const tokens = await this.generateToken(payload);
    if (!tokens) return { errId: MyError.BAD_REQUEST.errId };

    return { data: { accessToken: tokens.accessToken } };
  }

  async initSignup(data: InitSignupReq): Promise<ApiResponse<ISuccess>> {
    const existing = await UserEntity.findOne({
      where: { telegramId: String(data.telegramId) },
    });

    if (existing) {
      return { data: { success: true } };
    }

    const user = UserEntity.create({
      telegramId: String(data.telegramId),
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      languageCode: data.language ?? null,
      role: UserRole.CUSTOMER,
      userType: UserType.CUSTOMER,
      isActive: true,
    });
    await user.save();

    const customer = CustomerEntity.create({
      username: data.username ?? '',
      phone: data.phone,
      user,
    });
    await customer.save();

    return { data: { success: true } };
  }

  async verifyCode(data: IVerifyCodeReq): Promise<ApiResponse<ISuccess>> {
    const manager = await ManagerEntity.findOneBy({ inviteCode: data.code });
    if (!manager) return { errId: MyError.INVALID_CREDENTIALS.errId };

    const user = await UserEntity.findOneBy({ telegramId: data.telegramId });
    if (!user) return { errId: MyError.USER_NOT_FOUND.errId };

    manager.isVerified = true;
    manager.user = user;
    await manager.save();

    return { data: { success: true } };
  }

  async getProfile(data: IGetProfileReq): Promise<ApiResponse<IManager>> {
    const manager = await ManagerEntity.createQueryBuilder('m')
      .leftJoinAndSelect('m.role', 'role')
      .leftJoinAndSelect('m.user', 'user')
      .select([
        'm.id',
        'm.login',
        'm.inviteCode',
        'm.isVerified',
        'm.brandName',
        'm.phone',
        'm.photo',
        'm.isSuperadmin',
        'role.id',
        'role.name',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.telegramId',
        'user.isActive',
      ])
      .where('m.id = :id', { id: data.sub })
      .getOne();

    if (!manager) return { errId: MyError.USER_NOT_FOUND.errId };

    return { data: manager };
  }
}
