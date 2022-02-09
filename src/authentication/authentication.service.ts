import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import RegisterDto from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UserService) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.userService.createNewUser({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === '23505') {
        throw new HttpException(
          'Username or Email already taken',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async login(email: string, password: string) {
    try {
      const user = await this.userService.getUser(email);
      await this.verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong Password or Username',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Wrong Password or Username',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
