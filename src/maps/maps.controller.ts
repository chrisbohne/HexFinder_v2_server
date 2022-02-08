import { Body, Controller, Get, Post } from '@nestjs/common';
import CreateMapDto from './dto/createMap.dto';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get()
  getAllMaps() {
    return this.mapsService.getAllMaps();
  }

  @Post()
  async createMap(@Body() map: CreateMapDto) {
    return this.mapsService.createMap(map);
  }
}
