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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto, UpdateTopicDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards';
import { RequestWithUser } from 'src/auth/interfaces';
import { RoleGuard } from 'src/users/guards';
import { Role } from '@prisma/client';

@Controller('topics')
@UseInterceptors(ClassSerializerInterceptor)
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  // as Admin
  @Post('new/:userId')
  @UseGuards(RoleGuard(Role.ADMIN))
  create(@Body() dto: CreateTopicDto, @Param('userId') userId: string) {
    return this.topicsService.create(dto, +userId);
  }

  @Get('get')
  findAll() {
    return this.topicsService.findAll();
  }

  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(+id);
  }

  @Patch('update/:topicId/:userId')
  update(
    @Param('topicId') topicId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateTopicDto,
  ) {
    return this.topicsService.update(+topicId, +userId, dto);
  }

  @Delete('delete/:topicId/:userId')
  remove(@Param('topicId') topicId: string, @Param('userId') userId: string) {
    return this.topicsService.remove(+topicId, +userId);
  }

  // as logged in User
  @UseGuards(JwtAuthGuard)
  @Post('me')
  createTopic(@Body() dto: CreateTopicDto, @Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.topicsService.create(dto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/:topicId')
  updateMap(
    @Body() dto: UpdateTopicDto,
    @Param('topicId') topicId: string,
    @Req() req: RequestWithUser,
  ) {
    const { id } = req.user;
    return this.topicsService.update(+topicId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/:topicId')
  deleteMap(@Param('topicId') topicId: string, @Req() req: RequestWithUser) {
    const { id } = req.user;
    return this.topicsService.remove(+topicId, id);
  }
}
