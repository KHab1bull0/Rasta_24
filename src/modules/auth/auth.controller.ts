import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { InitSignupDto } from './dto/init-signup.dto';
import {
  IGetProfileReq,
  ILoginReq,
  InitSignupReq,
  ITokenPayload,
  ITelegramUser,
} from './auth.interface';
import { Public } from 'src/shared/decorators/public.decorator';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { TokenData } from 'src/shared/decorators/token-data.decorator';
import { TelegramGuard } from 'src/shared/guards/telegram.guard';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(TelegramGuard)
  @Post('telegram')
  @ApiOperation({ summary: 'TWA login — initData verify qilib JWT beradi' })
  @ApiHeader({ name: 'x-telegram-init-data', required: true })
  async telegramLogin(@Req() req: { telegramUser: ITelegramUser }) {
    return this.authService.telegramLogin(req.telegramUser);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Superadmin/Baker login — login + password → JWT' })
  async login(@Body() body: LoginDto) {
    const reqData: ILoginReq = { ...body };
    return this.authService.login(reqData);
  }

  @Public()
  @Post('init')
  @ApiOperation({ summary: 'Bot orqali customer signup (bot flow uchun)' })
  async initSignup(@Body() body: InitSignupDto) {
    const data: InitSignupReq = { ...body };
    return this.authService.initSignup(data);
  }

  @Public()
  @Post('verify-code')
  @ApiOperation({ summary: 'Manager invite code tasdiqlash' })
  async verifyCode(@Body() body: VerifyCodeDto) {
    return this.authService.verifyCode(body);
  }

  @Post('me')
  @ApiOperation({ summary: 'Joriy foydalanuvchi profili' })
  async getProfile(@TokenData() token: ITokenPayload) {
    const data: IGetProfileReq = { sub: token.sub };
    return this.authService.getProfile(data);
  }
}
