import { User } from '@/entities/user.entity.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { InMemoryRepository } from './base.repository.js';

export class UserInMemoryRepository
  extends InMemoryRepository<User>
  implements IUserRepository
{
  constructor() {
    // Pass initial data to the base class
    super();
  }

  // Implement the specific method for IUserRepository
  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email);
    return Promise.resolve(user || null);
  }
  // CRUD are from the base class
}
