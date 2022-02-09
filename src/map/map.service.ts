import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreateMapDto from './dto/createMap.dto';
import updateMapDto from './dto/updateMap.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import MapEntity from './map.entity';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(MapEntity)
    private mapRepository: Repository<MapEntity>,
  ) {}

  getAllMaps() {
    return this.mapRepository.find();
  }

  async getMapById(id: number) {
    const map = await this.mapRepository.findOne(id);
    if (map) {
      return map;
    }
    throw new HttpException('Map not found', HttpStatus.NOT_FOUND);
  }

  async createMap(map: CreateMapDto) {
    const newMap = await this.mapRepository.create(map);
    await this.mapRepository.save(newMap);
    return newMap;
  }

  async updateMap(id: number, map: updateMapDto) {
    await this.mapRepository.update(id, map);
    const updatedMap = await this.mapRepository.findOne(id);
    if (updatedMap) return updatedMap;
    throw new HttpException('Map not found', HttpStatus.NOT_FOUND);
  }

  async deleteMap(id: number) {
    const deleteResponse = await this.mapRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Map not found', HttpStatus.NOT_FOUND);
    }
  }
}
