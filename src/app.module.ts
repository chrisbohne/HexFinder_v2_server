import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MapModule } from './map/map.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot(), MapModule, DatabaseModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
