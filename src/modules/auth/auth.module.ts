import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TelegramGuard } from 'src/shared/guards/telegram.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TelegramGuard],
  exports: [AuthService],
})
export class AuthModule {}
