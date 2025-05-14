import { User } from '@src/entities/user.entity';

export interface IUserService {
  findById(id: string): Promise<User | null>;
}
