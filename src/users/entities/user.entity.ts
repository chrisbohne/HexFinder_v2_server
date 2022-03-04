import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updateAt: Date;
  name: string;
  email: string;

  @Exclude({ toPlainOnly: true })
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
