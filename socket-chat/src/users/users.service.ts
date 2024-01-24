import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, password, ...validDto } = createUserDto;

    const isUser = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (isUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = this.usersRepository.create({
      ...validDto,
      email,
      password: hashedPassword,
    });

    return await this.usersRepository.save(newUser);
  }

  async login({ email, password }: LoginDto) {
    const isUser = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (!isUser) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await bcryptjs.compare(password, isUser.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { email: isUser.email };

    const token = await this.jwtService.signAsync(payload);

    return {
      token: token,
      id: isUser.id,
      email: isUser.email,
    };
  }

  async findAll() {
    return await this.usersRepository.find({
      relations: ['chats'],
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        chats: true,
      },
    });

    return {
      chats: user.chats,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
