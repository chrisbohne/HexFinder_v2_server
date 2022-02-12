import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { MapEntity } from './entities/map.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MapEntity])],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
