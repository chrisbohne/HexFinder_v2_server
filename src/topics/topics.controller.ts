import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto, UpdateTopicDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { RequestWithUser } from 'src/auth/interfaces';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  // as Admin
  @Post(':userId')
  create(@Body() dto: CreateTopicDto, @Param('userId') userId: string) {
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

  @Patch(':topicId/:userId')
  update(
    @Param('topicId') topicId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateTopicDto,
  ) {
    return this.topicsService.update(+topicId, +userId, dto);
  }

  @Delete(':topicId/:userId')
  remove(@Param('topicId') topicId: string, @Param('userId') userId: string) {
    return this.topicsService.remove(+topicId, +userId);
  }

  // as logged in User
  @UseGuards(JwtAuthGuard)
  @Post('new')
  createTopic(@Body() dto: CreateTopicDto, @Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.topicsService.create(dto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:topicId')
  updateMap(
    @Body() dto: UpdateTopicDto,
    @Param('topicId') topicId: string,
    @Req() req: RequestWithUser,
  ) {
    const { id } = req.user;
    return this.topicsService.update(+topicId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:topicId')
  deleteMap(@Param('topicId') topicId: string, @Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.topicsService.remove(+topicId, id);
  }
}
