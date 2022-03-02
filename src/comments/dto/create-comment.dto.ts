import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
