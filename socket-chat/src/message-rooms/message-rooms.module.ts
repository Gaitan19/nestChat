import { Module } from '@nestjs/common';
import { MessageRoomsService } from './message-rooms.service';
import { MessageRoomsController } from './message-rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageRoom } from './entities/message-room.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageRoom]), RoomsModule],
  controllers: [MessageRoomsController],
  providers: [MessageRoomsService, RoomsService],
  exports: [TypeOrmModule],
})
export class MessageRoomsModule {}
