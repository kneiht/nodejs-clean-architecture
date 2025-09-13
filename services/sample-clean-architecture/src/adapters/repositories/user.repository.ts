import { User } from '@/entities/user.entity.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';

export class UserInMemoryRepository implements IUserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async add(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users[index] = user;
    return user;
  }

  async delete(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users.splice(index, 1);
  }
}
