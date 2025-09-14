import { ExpiresIn, IJsonWebToken } from '@/application/dependency-interfaces/utils/jwt.js';
import { User } from '@/entities/user.entity.js';
import { IUseCase } from '../use-case.interface.js';
import { AddUserUseCase } from '../user/add-user.use-case.js';

export type RegisterUseCaseInput = {
  email: string;
  name: string;
  password: string;
};

export type RegisterUseCaseOutput = {
  user: User;
  token: {
    accessToken: string;
    refreshToken: string;
  };
};

export class RegisterUseCase implements IUseCase<RegisterUseCaseInput, RegisterUseCaseOutput> {
  constructor(
    private addUserUseCase: AddUserUseCase,
    private jsonWebToken: IJsonWebToken,
  ) {}
  async execute(input: RegisterUseCaseInput): Promise<RegisterUseCaseOutput> {
    const user = await this.addUserUseCase.execute(input);
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
