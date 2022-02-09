import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import CreateMapDto from './dto/createMap.dto';
import updateMapDto from './dto/updateMap.dto';
import { MapService } from './map.service';

@Controller('maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  getAllMaps() {
    return this.mapService.getAllMaps();
  }

  @Get(':id')
  getMapById(@Param('id') id: string) {
    return this.mapService.getMapById(Number(id));
  }

  @Post()
  async createMap(@Body() map: CreateMapDto) {
    return this.mapService.createMap(map);
  }

  @Patch(':id')
  async updateMap(@Param('id') id: string, @Body() map: updateMapDto) {
    return this.mapService.updateMap(Number(id), map);
  }

  @Delete(':id')
  async deleteMap(@Param('id') id: string) {
    this.mapService.deleteMap(Number(id));
  }
}
