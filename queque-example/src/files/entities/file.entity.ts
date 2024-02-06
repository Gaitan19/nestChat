import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  // @Column({ type: 'text' })
  // base64Image: string;
}
