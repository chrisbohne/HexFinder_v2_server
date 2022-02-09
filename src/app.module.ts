import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MapModule } from './map/map.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), MapModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
