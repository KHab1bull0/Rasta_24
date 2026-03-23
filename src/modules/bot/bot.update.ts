import { Context } from 'grammy';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { BotService } from './bot.service';

@Injectable()
export class BotUpdate implements OnModuleInit {
  private readonly WEB_APP_URL: string;
  // telegramId → waiting for invite code
  private readonly waitingForCode = new Map<number, boolean>();

  constructor(
    config: ConfigService,
    private botService: BotService,
  ) {
    this.WEB_APP_URL = config.get('VITE_APP_URL');
  }

  onModuleInit() {
    const bot = this.botService.bot;

    bot.command('start', (ctx: Context) => {
      ctx.reply('Salom! Bot ishlamoqda 🤖', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Ilovaga kirish',
                web_app: { url: this.WEB_APP_URL },
              },
            ],
          ],
        },
      });
    });

    // Manager invite code flow
    bot.command('admin', (ctx: Context) => {
      this.waitingForCode.set(ctx.from.id, true);
      ctx.reply('🔑 Invite kodingizni yuboring:');
    });

    bot.on('message:text', async (ctx: Context) => {
      const fromId = ctx.from?.id;
      // skip commands and users not in waiting state
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
