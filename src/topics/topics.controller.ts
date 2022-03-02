import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto, UpdateTopicDto } from './dto';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post(':userId')
  create(@Body() dto: CreateTopicDto, @Param('userId') userId: string) {
    console.log(userId);
    return this.topicsService.create(dto, +userId);
  }

  @Get()
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.topicsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(+id);
  }
}
