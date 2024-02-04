import { Injectable } from '@nestjs/common';
import { CreateUserRoomDto } from './dto/create-user-room.dto';
import { UpdateUserRoomDto } from './dto/update-user-room.dto';
import { UserRoom } from './entities/user-room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRoomsService {
  constructor(
    @InjectRepository(UserRoom)
    private userRoomRepository: Repository<UserRoom>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(createUserRoomDto: CreateUserRoomDto) {
    const { roomName, ...validDto } = createUserRoomDto;
    const room = await this.roomsRepository.findOne({
      where: { roomName },
    });

    const newUserRoom = await this.userRoomRepository.create({
      ...validDto,
      room,
    });

    return await this.userRoomRepository.save(newUserRoom);
  }

  async findAll() {
    return await this.userRoomRepository.find({ relations: ['room'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} userRoom`;
  }

  update(id: number, updateUserRoomDto: UpdateUserRoomDto) {
    return `This action updates a #${id} userRoom`;
  }

  async remove(id: number) {
    await this.userRoomRepository.delete(id);

    // Puedes devolver un mensaje u objeto indicando que se eliminó con éxito
    return { message: `UserRoom with id ${id} has been successfully removed` };
  }
}
