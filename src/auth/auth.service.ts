import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './dto/authResponse.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import TokenPayload from './interfaces/tokenPayload.interface';
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
    return {
      token: this.jwtService.sign({ email: user.email }),
      user,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Wrong credentials provided');

    await this.verifyPassword(dto.password, user.password);

    const response = await this.signToken(user.id, user.email);

    delete user.password;

    return { ...response, user };
  }

  async validateUser({ email, password }: LoginDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    return user;
  }

  async getAuthenticatedUser({
    email,
    password,
  }: LoginDto): Promise<UserEntity> {
    try {
      const user = await this.userService.findByEmail(email);
      await this.verifyPassword(password, user.password);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Wrong credentials provided');
    }
  }

  async verifyPassword(password: string, hash: string) {
    const matchingPassword = await bcrypt.compare(password, hash);
    if (!matchingPassword)
      throw new ForbiddenException('Wrong credentials provided');
  }

  getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  getCookieForLogout() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  async signToken(userId: number, email: string): Promise<{ token: string }> {
    const payload = { sub: userId, email };
    const secret = this.configService.get('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return { token: token };
  }
}
