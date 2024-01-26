import { IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  email: string;

  @IsString()
  message: string;
}
