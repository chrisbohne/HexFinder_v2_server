import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updateAt: Date;
  username: string;
  email: string;
  role: Role;

  @Exclude()
  password: string;

  @Exclude()
  hashedRefreshToken: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
