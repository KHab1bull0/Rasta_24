import { Injectable } from '@nestjs/common';
import { IFindByTelegramIdReq } from './user.interface';
import { ApiResponse } from 'src/shared/types/interfaces';
import { UserEntity } from 'src/database/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(private readonly configService: ConfigService) {}

  async findByTelegramId(
    data: IFindByTelegramIdReq,
  ): Promise<ApiResponse<UserEntity>> {
    const user = await UserEntity.findOne({
      where: { telegramId: data.telegramId },
    });

    return { data: user };
  }
}
