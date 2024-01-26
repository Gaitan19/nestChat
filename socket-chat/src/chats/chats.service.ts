/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const { email, ...validDto } = createChatDto;
    const userM = await this.usersRepository.findOne({
      where: { email },
    });

    const chat = await this.chatsRepository.create({
      ...validDto,
      user: userM,
    });

    return await this.chatsRepository.save(chat);
  }

  findAll() {
    return this.chatsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
