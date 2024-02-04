import { Injectable } from '@nestjs/common';
import { CreateMessageRoomDto } from './dto/create-message-room.dto';
import { UpdateMessageRoomDto } from './dto/update-message-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRoom } from './entities/message-room.entity';
import { Repository } from 'typeorm';
import { Room } from 'src/rooms/entities/room.entity';

@Injectable()
export class MessageRoomsService {
  constructor(
    @InjectRepository(MessageRoom)
    private messageRoomRepository: Repository<MessageRoom>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(createMessageRoomDto: CreateMessageRoomDto) {
    const { roomName, ...validDto } = createMessageRoomDto;
    const room = await this.roomsRepository.findOne({
      where: { roomName },
    });

    const newMessage = await this.messageRoomRepository.create({
      ...validDto,
      room,
    });

    return await this.messageRoomRepository.save(newMessage);
  }

  async findAll() {
    return await this.messageRoomRepository.find({ relations: ['room'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} messageRoom`;
  }

  update(id: number, updateMessageRoomDto: UpdateMessageRoomDto) {
    return `This action updates a #${id} messageRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageRoom`;
  }
}
