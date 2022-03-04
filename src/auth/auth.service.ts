import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/users/entities';
import { TokenPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto): Promise<UserEntity> {
    return await this.userService.create(dto);
  }

  async login(dto: LoginDto): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Wrong credentials provided');

    await this.verifyPassword(dto.password, user.password);

    return user;
  }

  async verifyPassword(password: string, hash: string) {
    const matchingPassword = await bcrypt.compare(password, hash);
    if (!matchingPassword)
      throw new UnauthorizedException('Wrong credentials provided');
  }

  async getCookieWithJwtAccessToken(userId: number): Promise<string> {
    const payload: TokenPayload = { userId };
    const secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
    const expiresIn = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    );
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
      secret,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
  }

  async getCookieWithJwtRefreshToken(
    userId: number,
  ): Promise<{ cookie: string; token: string }> {
    const payload: TokenPayload = { userId };
    const secret = this.configService.get('JWT_REFRESH_TOKEN_SECRET');
    const expiresIn = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
      secret,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
    return {
      cookie,
      token,
    };
  }

  getCookieForLogout() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
