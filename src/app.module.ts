import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MapModule } from './maps/map.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TopicsModule } from './topics/topics.module';
import { CommentsModule } from './comments/comments.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
      isGlobal: true,
    }),
    MapModule,
    UserModule,
    AuthModule,
    PrismaModule,
    TopicsModule,
    CommentsModule,
  ],
})
export class AppModule {}
