import { Injectable } from '@nestjs/common';
import Maps from './maps.interface';
import CreateMapDto from './dto/createMap.dto';

@Injectable()
export class MapsService {
  private lastMapsId = 0;
  private maps: Maps[] = [];

  getAllMaps() {
    return this.maps;
  }

  createMap(map: CreateMapDto) {
    const newMap = {
      id: ++this.lastMapsId,
      ...map,
    };
    this.maps.push(newMap);
  }
}
