import { User } from '@/entities/user.entity.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { IPasswordHasher } from '@/application/dependency-interfaces/utils/password.js';
import { IUseCase } from '@/application/use-cases/use-case.interface.js';

export type AddUserUseCaseInput = {
  email: string;
  name: string;
  password: string;
};

export type AddUserUseCaseOutput = User;

export class AddUserUseCase implements IUseCase<AddUserUseCaseInput, AddUserUseCaseOutput> {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: AddUserUseCaseInput): Promise<AddUserUseCaseOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = new User({
      email: input.email,
      name: input.name,
      passwordHash: await this.passwordHasher.hash(input.password),
    });

    return user;
  }
}
