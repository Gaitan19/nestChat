import { IsString } from 'class-validator';

export class CreateMessageRoomDto {
  @IsString()
  message: string;

  @IsString()
  messageFrom: string;

  @IsString()
  roomName: string;
}
