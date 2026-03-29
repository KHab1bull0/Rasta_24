import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { BotContext, BotService } from './bot.service';

@Injectable()
export class BotUpdate implements OnModuleInit {
  private readonly WEB_APP_URL: string;
  private readonly waitingForCode = new Map<number, boolean>();

  constructor(
    config: ConfigService,
    private botService: BotService,
    private authService: AuthService,
  ) {
    this.WEB_APP_URL = config.get('VITE_APP_URL');
  }

  onModuleInit() {
    const bot = this.botService.bot;

    bot.command('start', (ctx: BotContext) => {
      ctx.reply(
        `Assalomu alaykum, \n\n📱 Davom etish uchun telefon raqamingizni ulashing:`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            keyboard: [
              [
                {
                  text: '📲 Telefon raqamni ulashish',
                  request_contact: true,
                },
              ],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        },
      );
    });

    bot.on('message:contact', async (ctx: BotContext) => {
      const contact = ctx.message.contact;
      const from = ctx.from;

      await this.authService.initSignup({
        telegramId: String(from.id),
        firstName: from.first_name ?? null,
        lastName: from.last_name ?? null,
        username: from.username ?? '',
        language: from.language_code ?? 'uz',
        phone: contact.phone_number,
      });

      await ctx.reply('👇 Ilovani ochish:', {
        parse_mode: 'HTML',
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: '🧁 Ilovani ochish',
                web_app: { url: this.WEB_APP_URL },
              },
            ],
            [
              {
                text: "🛒 Sotuvchi bo'lish",
              },
              {
                text: "💬 Admin bilan bog'lanish",
              },
            ],
          ],
        },
      });
    });

    bot.on('message:text', async (ctx: BotContext) => {
      const fromId = ctx.from?.id;
      if (!fromId || !this.waitingForCode.get(fromId)) return;
      if (ctx.message.text.startsWith('/')) {
        this.waitingForCode.delete(fromId);
        return;
      }

      this.waitingForCode.delete(fromId);

      const { message } = await this.botService.verifyAndLinkManager(
        ctx.message.text.trim(),
        String(fromId),
        ctx.from,
      );

      await ctx.reply(message);
    });
  }
}
