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
import { JwtRefreshGuard, JwtAuthGuard } from './guards';
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
    const accessToken = await this.authService.getJwtAccessToken(user.id);
    const refreshToken = await this.authService.getJwtRefreshToken(user.id);

    req.res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000 * 30,
    });
    return {
      username: user.username,
      email: user.email,
      id: user.id,
      accessToken,
      role: user.role,
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('logout')
  async logout(@Req() req: RequestWithUser) {
    req.res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return 'logged out';
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: RequestWithUser) {
    const accessToken = await this.authService.getJwtAccessToken(req.user.id);
    return {
      accessToken,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    };
  }
}
