import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { BadRequestException, Logger, OnModuleInit } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { Repository } from 'typeorm';
import { UserRoom } from 'src/user-rooms/entities/user-room.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(UserRoom)
    private userRoomRepository: Repository<UserRoom>,
    private readonly chatService: ChatService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const { name, token } = socket.handshake.auth;
      if (!name) {
        socket.disconnect();
        return;
      }

      this.chatService.onClientConnected({
        id: token,
        name: name,
        socketId: socket.id,
      });

      this.server.emit('on-clients-changed', this.chatService.getClients());

      socket.on('disconnect', () => {
        this.chatService.onClientDisconnected(token);
        this.server.emit('on-clients-changed', this.chatService.getClients());
      });
    });
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { name, token } = client.handshake.auth;
    if (!message) {
      return;
    }

    this.server.emit('on-message', {
      userId: client.id,
      message: message,
      name: name,
    });
  }

  @SubscribeMessage('private-message')
  handleMessagePrivate(
    @MessageBody() { message, to },
    @ConnectedSocket() client: Socket,
  ) {
    const { name, token } = client.handshake.auth;
    if (!message) {
      return;
    }
    console.log({ message, to });

    client.to(to).emit('private-message', {
      userId: client.id,
      message: message,
      name: name,
      isPrivate: true,
    });
  }

  @SubscribeMessage('join-room')
  async handleJoin(
    @MessageBody() { roomName, user, email },
    @ConnectedSocket() client: Socket,
  ) {
    if (!roomName) {
      return;
    }

    const room = await this.roomsRepository.findOne({ where: { roomName } });

    if (!room) {
      return;
    }

    client.join(roomName);

    const users = await this.userRoomRepository.find({ where: { room } });

    const usersInRoom = users.map((user) => user.email);
    if (!usersInRoom.includes(email)) {
      const newUserRoom = await this.userRoomRepository.create({
        email,
        room,
      });
      await this.userRoomRepository.save(newUserRoom);
    }

    this.server.emit('join-room', {
      room,
    });
  }

  @SubscribeMessage('room-message')
  handleMessageRoom(
    @MessageBody() { message, to },
    @ConnectedSocket() client: Socket,
  ) {
    const { name, token } = client.handshake.auth;
    if (!message) {
      return;
    }
    console.log({ message, to });

    client.to(to).emit('room-message', {
      userId: client.id,
      message: message,
      name: name,
      isPrivate: true,
    });
  }
}
