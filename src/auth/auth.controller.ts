import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import JwtAuthenticationGuard from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RequestWithUser from './interfaces/requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  // @HttpCode(200)
  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Req() request: RequestWithUser, @Res() response: Response) {
  //   const user = request.user;
  //   const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
  //   response.setHeader('Set-Cookie', cookie);
  //   user.password = undefined;
  //   return response.send(user);
  // }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  // @UseGuards(JwtAuthenticationGuard)
  // @Post('logout')
  // async logout(@Res() response: Response) {
  //   response.setHeader(
  //     'Set-Cookie',
  //     this.authService.getCookieForLogout(),
  //   );
  //   return response.sendStatus(200);
  // }

  // @UseGuards(JwtAuthenticationGuard)
  // @Get()
  // authenticate(@Req() request: RequestWithUser) {
  //   const user = request.user;
  //   user.password = undefined;
  //   return user;
  // }
}
