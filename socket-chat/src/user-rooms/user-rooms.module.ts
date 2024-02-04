import { Module } from '@nestjs/common';
import { UserRoomsService } from './user-rooms.service';
import { UserRoomsController } from './user-rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoom } from './entities/user-room.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoom]), RoomsModule],
  controllers: [UserRoomsController],
  providers: [UserRoomsService, RoomsService],
  exports: [TypeOrmModule],
})
export class UserRoomsModule {}
