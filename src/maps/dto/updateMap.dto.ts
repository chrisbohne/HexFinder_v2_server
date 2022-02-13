import { PartialType } from '@nestjs/mapped-types';
import { CreateMapDto } from './createMap.dto';

export class UpdateMapDto extends PartialType(CreateMapDto) {}
