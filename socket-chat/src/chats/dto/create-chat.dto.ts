import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  email: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @IsOptional()
  @IsString()
  messageFor: string;
}
