import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMapDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  mapData: string;
}
