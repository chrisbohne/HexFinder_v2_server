import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './guards';
import RequestWithUser from './interfaces/requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(dto);
    res.set('Authorization', 'Bearer ' + data.token);
    res.send({
      user: data.user,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogout());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
