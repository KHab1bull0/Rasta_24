import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { InitSignupDto } from './dto/init-signup.dto';
import { LoginReq } from './auth.interface';
import { Public } from 'src/shared/decorator/public.decorator';
import { TelegramGuard } from 'src/shared/guards/telegram.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('me')
  getMe(@Req() req: any) {
    return { status: 'ok', user: req.user };
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const reqData: LoginReq = { ...body };
    return this.authService.login(reqData);
  }

  @Public()
  @Post('init')
  @UseGuards(TelegramGuard)
  async initSignup(@Req() req: any, @Body() body: InitSignupDto) {
    return this.authService.initSignup(req.user, body.phone);
  }
}
