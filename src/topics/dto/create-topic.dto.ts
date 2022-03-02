import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
