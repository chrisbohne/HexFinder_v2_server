import { Topic } from '@prisma/client';

export class TopicEntity implements Topic {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  userId: number;
  vote: number;
}
