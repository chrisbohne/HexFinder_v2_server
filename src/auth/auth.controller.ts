import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { UpdateUserDto } from 'src/users/dto';
import { UserService } from 'src/users/user.service';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './guards';
import RequestWithUser from './interfaces/requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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
    res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
    return res.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getUser(@Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.userService.findOne(+id);
    // user.password = undefined;
    // return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  editUser(@Body() dto: UpdateUserDto, @Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.userService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  deleteUser(@Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.userService.remove(id);
  }
}
