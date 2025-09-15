import { User } from '@/entities/user.entity.js';
import { IBaseRepository } from './base.repository.js';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}
