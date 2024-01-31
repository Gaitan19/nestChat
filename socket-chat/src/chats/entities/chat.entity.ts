import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Chat {
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  message: string;

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ default: 'grupo' })
  messageFor: string;
  @Column({ default: 'grupo' })
  messageFrom: string;

  @ManyToOne(() => User, (user) => user.chats)
  user: User;
}
