import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    const room = await this.roomsRepository.create(createRoomDto);

    return await this.roomsRepository.save(room);
  }

  async findAll() {
    return await this.roomsRepository.find({
      relations: ['userRooms', 'messages'],
    });
  }

  async findOne(id: number) {
    return await this.roomsRepository.findOne({
      where: { id },
      relations: ['userRooms', 'messages'],
    });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    return await this.roomsRepository.findOne({
      where: { id },
      relations: ['userRooms', 'messages'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
