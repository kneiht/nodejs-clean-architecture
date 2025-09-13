import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { User } from '@/entities/user.entity.js';

export type UpdateUserUseCaseInput = {
  id: string;
  name?: string;
  email?: string;
};

export type UpdateUserUseCaseOutput = User;

export class UpdateUserUseCase
  implements IUseCase<UpdateUserUseCaseInput, UpdateUserUseCaseOutput>
{
  constructor(private userRepository: IUserRepository) {}

  async execute(input: UpdateUserUseCaseInput): Promise<User> {
    const { id, ...updates } = input;

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    if (updates.name) {
      user.name = updates.name;
    }
    if (updates.email) {
      const existingUser = await this.userRepository.findByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already in use by another account');
      }
      user.email = updates.email;
    }

    await this.userRepository.update(user);

    return user;
  }
}
