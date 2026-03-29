import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, Context } from 'grammy';
import { ManagerEntity } from 'src/database/entities/manager.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { UserRole, UserType } from 'src/shared/types/enums';

export type BotContext = Context;

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  readonly bot: Bot<BotContext>;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('BOT_TOKEN');
    this.bot = new Bot<BotContext>(token);
  }

  async onModuleInit() {
    await this.bot.init();

    await this.setDescriptions();

    this.bot.start();
  }

  async onModuleDestroy() {
    await this.bot.stop();
  }

  async verifyAndLinkManager(
    inviteCode: string,
    telegramId: string,
    telegramFrom: {
      first_name?: string;
      last_name?: string;
      language_code?: string;
    },
  ): Promise<{ success: boolean; message: string }> {
    const manager = await ManagerEntity.findOne({
      where: { inviteCode, isVerified: false },
      relations: { user: true },
    });

    if (!manager || manager.user) {
      return {
        success: false,
        message: "❌ Kod noto'g'ri yoki allaqachon ishlatilgan.",
      };
    }

    const user = UserEntity.create({
      telegramId,
      firstName: telegramFrom.first_name ?? null,
      lastName: telegramFrom.last_name ?? null,
      languageCode: telegramFrom.language_code ?? null,
      userType: UserType.MANAGER,
      role: UserRole.BAKER,
      isActive: true,
    });
    await user.save();

    manager.user = user;
    manager.isVerified = true;
    await manager.save();

    return {
      success: true,
      message:
        '✅ Muvaffaqiyatli tasdiqlandi! Endi manager sifatida kirishingiz mumkin.',
    };
  }

  private async setDescriptions() {
    await this.bot.api.deleteMyCommands();

    await this.bot.api.setMyDescription(
      'Xush kelibsiz! 👋\n\n' +
        'Rasta24 bilan mahsulot qidirish oson!\n\n' +
        '🧁 Buyurtma bering\n' +
        '📦 Buyurtma holatini kuzating\n' +
        "💬 Sotuvchi bilan bog'laning\n\n" +
        'Boshlash uchun /start bosing.',
    );
    await this.bot.api.setMyShortDescription(
      '🧁 Rasta24 bilan mahsulot qidirish oson!',
    );

    await this.bot.api.setMyCommands([
      {
        command: '/start',
        description: 'Ilovani ishga tushirish',
      },
    ]);
  }
}
