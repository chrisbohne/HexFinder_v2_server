import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMapDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  mapData: string;
}
