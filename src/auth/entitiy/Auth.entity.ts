import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AuthEntity implements User {
  id: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updateAt: Date;
  name: string;
  email: string;
  @Exclude({ toPlainOnly: true })
  password: string;
  cookie: string;

  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
  }
}
