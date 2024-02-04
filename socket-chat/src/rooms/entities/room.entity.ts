import { MessageRoom } from 'src/message-rooms/entities/message-room.entity';
import { UserRoom } from 'src/user-rooms/entities/user-room.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Room {
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  roomName: string;

  @OneToMany(() => UserRoom, (userRoom) => userRoom.room)
  userRooms: UserRoom[];

  @OneToMany(() => MessageRoom, (messageRoom) => messageRoom.room)
  messages: MessageRoom[];
}
