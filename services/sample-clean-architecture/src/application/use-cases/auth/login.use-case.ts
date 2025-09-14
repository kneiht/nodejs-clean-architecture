import { IJsonWebToken, ExpiresIn } from '@/application/dependency-interfaces/utils/jwt.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { IPasswordHasher } from '@/application/dependency-interfaces/utils/password.js';
import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import { User } from '@/entities/user.entity.js';

export type LoginUseCaseInput = {
  email: string;
  password: string;
};

export type LoginUseCaseOutput = {
  user: User;
  token: {
    accessToken: string;
    refreshToken: string;
  };
};

export class LoginUseCase implements IUseCase<LoginUseCaseInput, LoginUseCaseOutput> {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private jsonWebToken: IJsonWebToken,
  ) {}

  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await this.passwordHasher.verify(
      input.password,
      user.getPasswordHash(),
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const accessToken = await this.jsonWebToken.sign(
      { id: user.id, email: user.email, name: user.name },
      ExpiresIn.ONE_HOUR,
    );
    const refreshToken = await this.jsonWebToken.sign(
      { id: user.id, email: user.email, name: user.name },
      ExpiresIn.SEVEN_DAYS,
    );

    return {
      user,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }
}
