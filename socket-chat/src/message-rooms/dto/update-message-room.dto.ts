import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageRoomDto } from './create-message-room.dto';

export class UpdateMessageRoomDto extends PartialType(CreateMessageRoomDto) {}
