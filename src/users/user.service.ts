import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: { name: data.name },
    });
    if (userAlreadyExists) {
      throw new ConflictException('Username already taken');
    }

    const hash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: { ...data, password: hash },
    });

    user.password = undefined;
    return user;
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

  update(id, data: UpdateUserDto): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data });
  }

  remove(id: number): Promise<UserEntity> {
    return this.prisma.user.delete({ where: { id } });
  }
}
