import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { CreateMapDto } from './dto/createMap.dto';
import { UpdateMapDto } from './dto/updateMap.dto';
import { MapEntity } from './entities/map.entity';
import { MapService } from './map.service';

@Controller('maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() data: CreateMapDto): Promise<MapEntity> {
    return this.mapService.create(data);
  }

  @Get()
  findAll(): Promise<MapEntity[]> {
    return this.mapService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MapEntity> {
    return this.mapService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateMapDto,
  ): Promise<MapEntity> {
    return this.mapService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<MapEntity> {
    return this.mapService.remove(+id);
  }
}