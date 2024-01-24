import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Chat {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ unique: true, nullable: false })
  message: string;

  @ManyToOne(() => User, (user) => user.chats)
  user: User;
}
