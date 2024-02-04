import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class MessageRoom {
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  message: string;

  @Column({ default: 'grupo' })
  messageFrom: string;

  @ManyToOne(() => Room, (room) => room.messages)
  room: Room;
}
