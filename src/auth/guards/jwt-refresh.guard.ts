import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  constructor() {
    super();
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new ForbiddenException('Not authorized');
    }
    return user;
  }
}
