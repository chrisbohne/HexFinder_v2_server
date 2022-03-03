import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const data = await this.authService.register(dto);
    res.setHeader('Set-Cookie', data.cookie);
    res.send({ user: data.user });
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(dto);
    res.setHeader('Set-Cookie', data.cookie);
    res.send({ user: data.user });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    const cookie = await this.authService.getCookieForLogout();
    res.setHeader('Set-Cookie', cookie);
    res.sendStatus(200);
  }
}
