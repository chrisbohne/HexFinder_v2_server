import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserEntity } from 'src/users/entities';
import { UserService } from 'src/users/user.service';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard, JwtRefreshGuard } from './guards';
import { RequestWithUser } from './interfaces';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return new UserEntity(user);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: RequestWithUser) {
    const user = await this.authService.login(dto);
    const accessTokenCookie =
      await this.authService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      await this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return new UserEntity(user);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    await this.userService.removeCurrentRefreshToken(req.user.id);
    const cookie = await this.authService.getCookieForLogout();
    req.res.setHeader('Set-Cookie', cookie);
    return 'logged out';
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: RequestWithUser) {
    const accessTokenCookie =
      await this.authService.getCookieWithJwtAccessToken(req.user.id);
    req.res.setHeader('Set-Cookie', accessTokenCookie);
    return new UserEntity(req.user);
  }
}
