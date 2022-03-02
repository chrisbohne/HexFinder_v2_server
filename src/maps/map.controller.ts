import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { CreateMapDto, UpdateMapDto } from './dto';
import { MapEntity } from './entities';
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
  update(@Param('id') id: string, @Body() dto: UpdateMapDto) {
    return this.mapService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mapService.remove(+id);
  }
}
