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
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get()
  getAllMaps() {
    return this.mapsService.getAllMaps();
  }

  @Get(':id')
  getMapById(@Param('id') id: string) {
    return this.mapsService.getMapById(Number(id));
  }

  @Post()
  async createMap(@Body() map: CreateMapDto) {
    return this.mapsService.createMap(map);
  }

  @Patch(':id')
  async updateMap(@Param('id') id: string, @Body() map: updateMapDto) {
    return this.mapsService.updateMap(Number(id), map);
  }

  @Delete(':id')
  async deleteMap(@Param('id') id: string) {
    this.mapsService.deleteMap(Number(id));
  }
}
