import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { RequestWithUser } from 'src/auth/interfaces';
import { CreateMapDto, UpdateMapDto } from './dto';
import { MapService } from './map.service';

@Controller('maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  // as admin

  @Post('new/:userId')
  create(@Param('userId') userId: string, @Body() dto: CreateMapDto) {
    return this.mapService.create(dto, +userId);
  }

  @Get('get')
  findAll() {
    return this.mapService.findAll();
  }

  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.mapService.findOne(+id);
  }

  @Patch('/update/:mapId/:userId')
  update(
    @Param('mapId') mapId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateMapDto,
  ) {
    return this.mapService.update(+mapId, +userId, dto);
  }

  @Delete('/delete/:mapId/:userId')
  remove(@Param('mapId') mapId: string, @Param('userId') userId: string) {
    return this.mapService.remove(+mapId, +userId);
  }

  // as logged in user

  @UseGuards(JwtAuthGuard)
  @Post('/me')
  createMap(@Body() dto: CreateMapDto, @Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.mapService.create(dto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/:mapId')
  updateMap(
    @Body() dto: UpdateMapDto,
    @Param('mapId') mapId: string,
    @Req() req: RequestWithUser,
  ) {
    const { id } = req.user;
    return this.mapService.update(+mapId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/:mapId')
  deleteMap(@Param('mapId') mapId: string, @Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.mapService.remove(+mapId, id);
  }
}
