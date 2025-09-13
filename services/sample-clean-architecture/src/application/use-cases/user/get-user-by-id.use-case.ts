import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { User } from '@/entities/user.entity.js';

export type GetUserByIdUseCaseInput = {
  id: string;
};

export type GetUserByIdUseCaseOutput = User;

export class GetUserByIdUseCase
  implements IUseCase<GetUserByIdUseCaseInput, GetUserByIdUseCaseOutput>
{
  constructor(private userRepository: IUserRepository) {}

  async execute({ id }: GetUserByIdUseCaseInput): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }
}
