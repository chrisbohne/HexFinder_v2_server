import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { AuthEntity } from './entitiy/Auth.entity';
import { JwtAuthGuard } from './guards';
import { RequestWithUser } from './interfaces';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: RequestWithUser) {
    const user = await this.authService.register(dto);
    req.res.setHeader('Set-Cookie', user.cookie);
    return new AuthEntity(user);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: RequestWithUser) {
    const user = await this.authService.login(dto);
    req.res.setHeader('Set-Cookie', user.cookie);
    return new AuthEntity(user);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    const cookie = await this.authService.getCookieForLogout();
    req.res.setHeader('Set-Cookie', cookie);
    return 'logged out';
  }
}
