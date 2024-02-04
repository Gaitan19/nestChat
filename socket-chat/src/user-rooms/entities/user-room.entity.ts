import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class UserRoom {
  @Column({ primary: true, generated: true })
  id: number;
  @Column()
  email: string;

  @ManyToOne(() => Room, (room) => room.userRooms)
  room: Room;
}
