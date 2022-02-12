import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 30)
  email: string;

  @IsEmail()
  name: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
