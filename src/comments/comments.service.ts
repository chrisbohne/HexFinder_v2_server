import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { CommentEntity } from './entities';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    topicId: number,
    userId: number,
    dto: CreateCommentDto,
  ): Promise<CommentEntity> {
    return this.prisma.comment.create({
      data: {
        ...dto,
        user: { connect: { id: userId } },
        topic: { connect: { id: topicId } },
      },
    });
  }

  findAll(): Promise<CommentEntity[]> {
    return this.prisma.comment.findMany();
  }

  async findOne(id: number): Promise<CommentEntity> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(
    commentId: number,
    userId: number,
    dto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    const map = await this.findOne(commentId);

    if (!map || map.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    try {
      return await this.prisma.comment.update({
        where: { id: commentId },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Comment not found');
      } else throw error;
    }
  }

  async remove(commentId: number, userId: number): Promise<string> {
    const map = await this.findOne(commentId);

    if (!map || map.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    try {
      await this.prisma.comment.delete({ where: { id: commentId } });
      return 'Comment deleted';
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Comment not found');
      } else throw error;
    }
  }
}
