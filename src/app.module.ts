import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MapsModule } from './maps/maps.module';

@Module({
  imports: [MapsModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
