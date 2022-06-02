import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateMapDto {
  @IsNotEmpty()
  @MaxLength(25)
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  mapData: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;
}
