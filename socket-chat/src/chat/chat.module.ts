import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { RoomsModule } from 'src/rooms/rooms.module';
import { RoomsService } from 'src/rooms/rooms.service';
import { UserRoomsModule } from 'src/user-rooms/user-rooms.module';
import { UserRoomsService } from 'src/user-rooms/user-rooms.service';
import { Room } from 'src/rooms/entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageRoomsModule } from 'src/message-rooms/message-rooms.module';
import { MessageRoomsService } from 'src/message-rooms/message-rooms.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Room]),
    RoomsModule,
    UserRoomsModule,
    MessageRoomsModule,
  ],
  providers: [
    ChatGateway,
    ChatService,
    RoomsService,
    UserRoomsService,
    MessageRoomsService,
  ],
})
export class ChatModule {}
