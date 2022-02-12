import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MapModule } from './map/map.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MapModule,
    UserModule,
    AuthenticationModule,
    PrismaModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
