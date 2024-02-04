import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageRoomsService } from './message-rooms.service';
import { CreateMessageRoomDto } from './dto/create-message-room.dto';
import { UpdateMessageRoomDto } from './dto/update-message-room.dto';

@Controller('message-rooms')
export class MessageRoomsController {
  constructor(private readonly messageRoomsService: MessageRoomsService) {}

  @Post()
  create(@Body() createMessageRoomDto: CreateMessageRoomDto) {
    return this.messageRoomsService.create(createMessageRoomDto);
  }

  @Get()
  findAll() {
    return this.messageRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageRoomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageRoomDto: UpdateMessageRoomDto) {
    return this.messageRoomsService.update(+id, updateMessageRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageRoomsService.remove(+id);
  }
}
