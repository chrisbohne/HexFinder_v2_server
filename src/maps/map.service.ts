import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMapDto, UpdateMapDto } from './dto';
import { MapEntity } from './entities';

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMapDto, userId: number): Promise<MapEntity> {
    return this.prisma.map.create({
      data: { ...dto, user: { connect: { id: userId } } },
    });
  }

  findAll(): Promise<MapEntity[]> {
    return this.prisma.map.findMany();
  }

  async findOne(id: number): Promise<MapEntity> {
    const map = await this.prisma.map.findUnique({ where: { id } });
    if (!map) throw new NotFoundException('Map not found');
    return map;
  }

  async update(
    mapId: number,
    userId: number,
    dto: UpdateMapDto,
  ): Promise<MapEntity> {
    const map = await this.prisma.map.findUnique({ where: { id: mapId } });

    if (!map || map.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    try {
      return await this.prisma.map.update({ where: { id: mapId }, data: dto });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Map not found');
      } else throw error;
    }
  }

  async remove(mapId: number, userId: number): Promise<string> {
    const map = await this.prisma.map.findUnique({ where: { id: mapId } });

    if (!map || map.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    try {
      await this.prisma.map.delete({ where: { id: mapId } });
      return 'Map deleted';
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Map not found');
      } else throw error;
    }
  }
}
