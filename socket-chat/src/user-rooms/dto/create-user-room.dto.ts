import { IsString } from 'class-validator';

export class CreateUserRoomDto {
  @IsString()
  roomName: string;

  @IsString()
  email: string;
}
