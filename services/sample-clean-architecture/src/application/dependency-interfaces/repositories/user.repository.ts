import { User } from '@/entities/user.entity.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  add(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(user: User): Promise<void>;
}
