import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
import { ManagerEntity } from 'src/database/entities/manager.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { UserType } from 'src/shared/types/enums';

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  readonly bot: Bot;
  private readonly WEB_APP_URL: string;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('BOT_TOKEN');
    this.bot = new Bot(token);
    this.WEB_APP_URL = this.configService.get<string>('VITE_APP_URL');
  }

  async onModuleInit() {
    this.bot.init();

    this.bot.api.setChatMenuButton({
      menu_button: {
        text: 'Ilovaga kirish',
        type: 'web_app',
        web_app: { url: this.WEB_APP_URL },
      },
    });

    this.bot.start();
  }

  async onModuleDestroy() {
    await this.bot.stop();
  }

  async verifyAndLinkManager(
    inviteCode: string,
    telegramId: string,
    telegramFrom: { first_name?: string; last_name?: string; language_code?: string },
  ): Promise<{ success: boolean; message: string }> {
    const manager = await ManagerEntity.findOne({
      where: { inviteCode, isVerified: false },
      relations: { user: true },
    });

    if (!manager) {
      return { success: false, message: "❌ Kod noto'g'ri yoki allaqachon ishlatilgan." };
    }

    if (manager.user) {
      return { success: false, message: '❌ Bu kod allaqachon ishlatilgan.' };
    }

    const user = UserEntity.create({
      telegramId,
      firstName: telegramFrom.first_name ?? null,
      lastName: telegramFrom.last_name ?? null,
      languageCode: telegramFrom.language_code ?? null,
      userType: UserType.MANAGER,
      isActive: true,
    });
    await user.save();

    manager.user = user;
    manager.isVerified = true;
    await manager.save();

    return {
      success: true,
      message: "✅ Muvaffaqiyatli tasdiqlandi! Endi manager sifatida kirishingiz mumkin.",
    };
  }
}
