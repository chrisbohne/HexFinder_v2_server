import { Request } from 'express';
import UserEntity from 'src/user/user.entity';

interface RequestWithUser extends Request {
  user: UserEntity;
}

export default RequestWithUser;
