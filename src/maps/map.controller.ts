import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { CreateMapDto } from './dto/createMap.dto';
import { UpdateMapDto } from './dto/updateMap.dto';
import { MapEntity } from './entities/map.entity';
import { MapService } from './map.service';

@Controller('maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post(':userId')
  create(@Param('userId') userId: string, @Body() dto: CreateMapDto) {
    return this.mapService.create(dto, +userId);
  }

  @Get()
  findAll() {
    return this.mapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mapService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMapDto,
  ): Promise<MapEntity> {
    return this.mapService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mapService.remove(+id);
  }
}
