import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';

export type DeleteUserUseCaseInput = {
  id: string;
};

export class DeleteUserUseCase implements IUseCase<DeleteUserUseCaseInput, void> {
  constructor(private userRepository: IUserRepository) {}

  async execute({ id }: DeleteUserUseCaseInput): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    await this.userRepository.delete(user);
  }
}
