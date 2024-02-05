import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { UserRoomsModule } from './user-rooms/user-rooms.module';
import { MessageRoomsModule } from './message-rooms/message-rooms.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'chatDB',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UsersModule,
    ChatsModule,
    RoomsModule,
    UserRoomsModule,
    MessageRoomsModule,
  ],
})
export class AppModule {}
