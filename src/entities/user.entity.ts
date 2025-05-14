import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ length: 124, type: 'varchar' })
  password: string;

  @Column({ length: 50, type: 'varchar' })
  email: string;
}
