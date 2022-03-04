import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './entities';
import * as bcrypt from 'bcrypt';
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
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }

  findAll(): Promise<UserEntity[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { maps: true, topics: true, comments: true },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findOne(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatching) return user;
  }

  async update(id, dto: UpdateUserDto): Promise<UserEntity> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dto,
      });
      return updatedUser;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      } else throw error;
    }
  }

  async remove(id: number): Promise<string> {
    try {
      await this.prisma.map.deleteMany({ where: { userId: id } });
      await this.prisma.user.delete({ where: { id }, include: { maps: true } });
      return 'User deleted';
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      } else throw error;
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  removeCurrentRefreshToken(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }
}
