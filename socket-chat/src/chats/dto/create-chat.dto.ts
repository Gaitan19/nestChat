import { IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  idUser: number;

  @IsString()
  message: string;
}
