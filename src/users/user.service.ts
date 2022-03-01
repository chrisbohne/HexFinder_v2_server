import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const hash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: { ...dto, password: hash },
      });

      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  findAll(): Promise<UserEntity[]> {
    return this.prisma.user.findMany();
  }

  async findByName(name: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { name } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  update(id, data: UpdateUserDto): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data });
  }

  remove(id: number): Promise<UserEntity> {
    return this.prisma.user.delete({ where: { id } });
  }
}
