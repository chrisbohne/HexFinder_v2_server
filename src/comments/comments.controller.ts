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
import { JwtAuthGuard } from 'src/auth/guards';
import { RequestWithUser } from 'src/auth/interfaces';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // as admin

  @Post('/:topicId/:userId')
  create(
    @Body() dto: CreateCommentDto,
    @Param('userId') userId: string,
    @Param('topicId') topicId: string,
  ) {
    console.log('bla');
    return this.commentsService.create(+topicId, +userId, dto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':commentId/:userId')
  update(
    @Param('commentId') commentId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(+commentId, +userId, dto);
  }

  @Delete(':commentId/:userId')
  remove(
    @Param('commentId') commentId: string,
    @Param('userId') userId: string,
  ) {
    return this.commentsService.remove(+commentId, +userId);
  }

  // as logged in User
  @UseGuards(JwtAuthGuard)
  @Post('new/:commentId')
  createTopic(
    @Body() dto: CreateCommentDto,
    @Param('commentId') commentId: string,
    @Req() req: RequestWithUser,
  ) {
    const { id } = req.user;
    return this.commentsService.create(+commentId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:commentId')
  updateMap(
    @Body() dto: UpdateCommentDto,
    @Param('commentId') commentId: string,
    @Req() req: RequestWithUser,
  ) {
    const { id } = req.user;
    return this.commentsService.update(+commentId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:commentId')
  deleteMap(
    @Param('commentId') commentId: string,
    @Req() req: RequestWithUser,
  ) {
    const { id } = req.user;
    return this.commentsService.remove(+commentId, id);
  }
}
