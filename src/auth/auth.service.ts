import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
// import TokenPayload from './interfaces/tokenPayload.interface';
import { AuthResponse } from './dto/authResponse.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<AuthResponse> {
    const user = await this.userService.create(data);
    return {
      token: this.jwtService.sign({ email: user.email }),
      user,
    };
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await this.userService.findByEmail(email);

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    return {
      token: this.jwtService.sign({ email }),
      user,
    };
  }

  async validateUser({ email, password }: LoginDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === password) {
      user.password = undefined;
      return user;
    }
    return null;
  }

  // public getCookieWithJwtToken(userId: number) {
  //   const payload: TokenPayload = { userId };
  //   const token = this.jwtService.sign(payload);
  //   return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
  //     'JWT_EXPIRATION_TIME',
  //   )}`;
  // }

  // public getCookieForLogout() {
  //   return `Authentication=; HttpOnly; Path=/; Mag-Age=0`;
  // }

  // private async verifyPassword(password: string, hashedPassword: string) {
  //   const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  //   if (!isPasswordCorrect) {
  //     throw new HttpException(
  //       'Wrong Password or Username',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }
}
