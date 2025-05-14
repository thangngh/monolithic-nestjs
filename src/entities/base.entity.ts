import { Type } from 'class-transformer';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class BaseEntities extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Type(() => Date)
  @Column({ name: 'create_at', default: () => 'now()', type: 'timestamp' })
  public createAt: Date;
}
