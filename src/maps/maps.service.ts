import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Maps from './maps.interface';
import CreateMapDto from './dto/createMap.dto';
import updateMapDto from './dto/updateMap.dto';

@Injectable()
export class MapsService {
  private lastMapsId = 0;
  private maps: Maps[] = [
    { id: 1, name: 'example map', mapData: 'datatatatat' },
  ];

  getAllMaps() {
    return this.maps;
  }

  getMapById(id: number) {
    const map = this.maps.find((map) => map.id === id);
    if (map) {
      return map;
    }
    throw new HttpException('Map not found', HttpStatus.NOT_FOUND);
  }

  createMap(map: CreateMapDto) {
    const newMap = {
      id: ++this.lastMapsId,
      ...map,
    };
    this.maps.push(newMap);
  }

  updateMap(id: number, map: updateMapDto) {
    const mapIndex = this.maps.findIndex((map) => map.id === id);
    if (mapIndex > -1) {
      this.maps[mapIndex] = map;
      return map;
    }
    throw new HttpException('Map not found', HttpStatus.NOT_FOUND);
  }

  deleteMap(id: number) {
    const mapIndex = this.maps.findIndex((map) => map.id === id);
    if (mapIndex > -1) {
      this.maps.splice(mapIndex, 1);
    } else {
      throw new HttpException('Map not found', HttpStatus.NOT_FOUND);
    }
  }
}
