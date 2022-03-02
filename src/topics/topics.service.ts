import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTopicDto, UpdateTopicDto } from './dto';
import { TopicEntity } from './entities';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTopicDto, userId: number): Promise<TopicEntity> {
    return this.prisma.topic.create({
      data: { ...dto, User: { connect: { id: userId } } },
    });
  }

  findAll(): Promise<TopicEntity[]> {
    return this.prisma.topic.findMany();
  }

  async findOne(id: number): Promise<TopicEntity> {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic) throw new NotFoundException('Topic not found');
    return topic;
  }

  async update(id: number, dto: UpdateTopicDto): Promise<TopicEntity> {
    try {
      return await this.prisma.topic.update({ where: { id }, data: dto });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Topic not found');
      } else throw error;
    }
  }

  async remove(id: number): Promise<string> {
    try {
      await this.prisma.topic.delete({ where: { id } });
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
