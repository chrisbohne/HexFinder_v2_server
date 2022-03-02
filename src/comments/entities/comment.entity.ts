import { Comment } from '@prisma/client';

export class CommentEntity implements Comment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  userId: number;
  vote: number;
  topicId: number;
}
