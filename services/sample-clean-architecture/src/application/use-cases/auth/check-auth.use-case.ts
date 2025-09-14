import { IJsonWebToken } from '@/application/dependency-interfaces/utils/jwt.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import { User } from '@/entities/user.entity.js';

export type CheckAuthUseCaseInput = string;

export type CheckAuthUseCaseOutput = User;

export class CheckAuthUseCase implements IUseCase<CheckAuthUseCaseInput, CheckAuthUseCaseOutput> {
  constructor(
    private jsonWebToken: IJsonWebToken,
    private userRepository: IUserRepository,
  ) {}

  async execute(token: CheckAuthUseCaseInput): Promise<CheckAuthUseCaseOutput> {
    try {
      const payload = await this.jsonWebToken.verify(token);
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      const user = await this.userRepository.findById(payload.id);
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }
}
