import { IJsonWebToken, ExpiresIn } from '@/application/dependency-interfaces/utils/jwt.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { IPasswordHasher } from '@/application/dependency-interfaces/utils/password.js';
import { IUseCase } from '@/application/use-cases/index.js';
import { User } from '@/entities/user.entity.js';
import { failureInternal, failureUnauthorized, successOk, UseCaseReponse } from '../response.js';

// Define input
export type LoginUseCaseInput = {
  email: string;
  password: string;
};

// Define data for the response
export type LoginUseCaseData = {
  user: User;
  token: {
    accessToken: string;
    refreshToken: string;
  };
};

// Define the use case
export class LoginUseCase implements IUseCase<LoginUseCaseInput, LoginUseCaseData> {
  // Inject dependencies
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private jsonWebToken: IJsonWebToken,
  ) {}

  // Execute the use case
  async execute(input: LoginUseCaseInput): Promise<UseCaseReponse<LoginUseCaseData>> {
    // Catch any errors
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(input.email);
      if (!user) {
        return failureUnauthorized('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await this.passwordHasher.verify(
        input.password,
        user.getPasswordHash(),
      );
      if (!isPasswordValid) {
        return failureUnauthorized('Invalid email or password');
      }

      // Create JWT payload
      const payload = { id: user.id, email: user.email, name: user.name };

      // Sign tokens
      const accessToken = await this.jsonWebToken.sign(payload, ExpiresIn.ONE_HOUR);
      const refreshToken = await this.jsonWebToken.sign(payload, ExpiresIn.SEVEN_DAYS);

      // Return success response with user and tokens
      return successOk({
        user,
        token: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      // Handle other errors
      return failureInternal('An unexpected error occurred during login.');
    }
  }
}
