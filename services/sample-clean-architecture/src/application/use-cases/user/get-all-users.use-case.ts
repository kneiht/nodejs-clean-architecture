
import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { User } from '@/entities/user.entity.js';

export class GetAllUsersUseCase implements IUseCase<void, User[]> {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
