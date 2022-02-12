import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateMapDto from './dto/createMap.dto';
import UpdateMapDto from './dto/updateMap.dto';
import { MapEntity } from './entities/map.entity';

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateMapDto): Promise<MapEntity> {
    return this.prisma.map.create({ data });
  }

  findAll(): Promise<MapEntity[]> {
    return this.prisma.map.findMany();
  }

  findOne(id: number): Promise<MapEntity> {
    return this.prisma.map.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateMapDto): Promise<MapEntity> {
    return this.prisma.map.update({ where: { id }, data });
  }

  remove(id: number): Promise<MapEntity> {
    return this.prisma.map.delete({ where: { id } });
  }
}
