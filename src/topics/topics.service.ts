import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTopicDto, UpdateTopicDto } from './dto';
import { TopicEntity } from './entities';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTopicDto, userId: number): Promise<TopicEntity> {
    return this.prisma.topic.create({
      data: { ...dto, user: { connect: { id: userId } } },
    });
  }

  findAll(): Promise<TopicEntity[]> {
    return this.prisma.topic.findMany({
      include: { comments: true, user: { select: { name: true } } },
    });
  }

  async findOne(id: number): Promise<TopicEntity> {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
      include: { comments: true, user: { select: { name: true } } },
    });
    if (!topic) throw new NotFoundException('Topic not found');
    return topic;
  }

  async update(
    topicId: number,
    userId: number,
    dto: UpdateTopicDto,
  ): Promise<TopicEntity> {
    const topic = await this.findOne(topicId);

    if (!topic || topic.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    try {
      return await this.prisma.topic.update({
        where: { id: topicId },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Topic not found');
      } else throw error;
    }
  }

  async remove(topicId: number, userId: number): Promise<string> {
    const topic = await this.findOne(topicId);

    if (!topic || topic.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    try {
      await this.prisma.topic.delete({ where: { id: topicId } });
      return 'Topic deleted';
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Topic not found');
      } else throw error;
    }
  }
}
