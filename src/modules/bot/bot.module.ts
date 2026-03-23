import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';

@Module({
  providers: [BotService, BotUpdate],
  exports: [BotService],
})
export class BotModule {}
