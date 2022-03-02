import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { RegisterDto, AuthResponse, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const user = await this.userService.create(dto);

    const cookie = await this.getCookieWithJwtToken(user.id, user.email);
    return { cookie, user };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Wrong credentials provided');

    await this.verifyPassword(dto.password, user.password);

    const cookie = await this.getCookieWithJwtToken(user.id, user.email);

    delete user.password;

    return { cookie, user };
  }

  async verifyPassword(password: string, hash: string) {
    const matchingPassword = await bcrypt.compare(password, hash);
    if (!matchingPassword)
      throw new UnauthorizedException('Wrong credentials provided');
  }

  async getCookieWithJwtToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email };
    const secret = this.configService.get('JWT_SECRET');
    const expiresIn = this.configService.get('JWT_EXPIRATION_TIME');
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
      secret,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
  }

  getCookieForLogout() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
