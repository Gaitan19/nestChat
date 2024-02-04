import { Chat } from 'src/chats/entities/chat.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];
}
