import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('system_settings')
export class LoggerSettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @Column({ nullable: true })
  description: string;
}
