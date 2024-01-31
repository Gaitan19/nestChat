import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

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
    });
  }
}
