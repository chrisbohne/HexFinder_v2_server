import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MapModule } from './maps/map.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MapModule,
    UserModule,
    AuthModule,
    PrismaModule,
  ],
  providers: [],
})
export class AppModule {}
