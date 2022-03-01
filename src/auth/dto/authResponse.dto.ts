import { User } from '@prisma/client';

export class AuthResponse {
  cookie: string;
  user: User;
}
