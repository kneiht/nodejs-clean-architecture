import { IJsonWebToken } from '@/application/dependency-interfaces/utils/jwt.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { IUseCase } from '@/application/use-cases/index.js';
import { User } from '@/entities/user.entity.js';
import { failureUnauthorized, successOk, UseCaseReponse } from '../response.js';

// Define input
export type CheckAuthUseCaseInput = string | undefined;

// Define data for the response
export type CheckAuthUseCaseData = User;

// Define the use case
export class CheckAuthUseCase implements IUseCase<CheckAuthUseCaseInput, CheckAuthUseCaseData> {
  // Inject dependencies
  constructor(
    private jsonWebToken: IJsonWebToken,
    private userRepository: IUserRepository,
  ) {}

  // Execute the use case
  async execute(token: CheckAuthUseCaseInput): Promise<UseCaseReponse<CheckAuthUseCaseData>> {
    // Catch any errors
    try {
      // Check if the token is provided
      if (!token) {
        return failureUnauthorized('Access token is missing');
      }

      // Verify the token
      const payload = await this.jsonWebToken.verify(token);
      if (!payload) {
        return failureUnauthorized('Invalid token payload');
      }

      // Find the user by ID
      const user = await this.userRepository.findById(payload.id);
      if (!user) {
        return failureUnauthorized('User not found');
      }

      // Return the user
      return successOk(user);
    } catch (error) {
      return failureUnauthorized('Authentication failed');
    }
  }
}
