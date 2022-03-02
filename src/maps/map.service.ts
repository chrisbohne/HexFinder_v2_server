import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMapDto } from './dto/createMap.dto';
import { UpdateMapDto } from './dto/updateMap.dto';
import { MapEntity } from './entities/map.entity';

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMapDto, userId: number): Promise<MapEntity> {
    return this.prisma.map.create({
      data: { ...dto, User: { connect: { id: userId } } },
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

  async update(id: number, data: UpdateMapDto): Promise<MapEntity> {
    try {
      return await this.prisma.map.update({ where: { id }, data });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Map not found');
      } else throw error;
    }
  }

  async remove(id: number): Promise<string> {
    try {
      await this.prisma.map.delete({ where: { id } });
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
