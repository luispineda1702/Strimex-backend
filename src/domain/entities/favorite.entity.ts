import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum MediaType {
  MOVIE = 'movie',
  TV = 'tv',
}

@Entity({ name: 'favorites' })
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mediaId: number;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  mediaType: MediaType;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user: User;
}
