import { User } from '@prisma/client';

export class UserEntity implements User {
  id: number;
  createdAt: Date;
  updateAt: Date;
  name: string;
  email: string;
  password: string;
}
