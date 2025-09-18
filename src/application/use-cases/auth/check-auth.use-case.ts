import z from 'zod';
import { IJsonWebToken } from '@/application/dependency-interfaces/utils/jwt.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { IUseCase } from '@/application/use-cases/index.js';
import { User } from '@/entities/user.entity.js';
import {
  failureUnauthorized,
  failureValidation,
  successOk,
  UseCaseReponse,
} from '../response.js';

// Define input schema
const checkAuthInputSchema = z.object({
  token: z
    .string('Access token is required')
    .min(1, { error: 'Access token cannot be empty' }),
  roleToCheck: z.enum(['admin', 'user']).optional().default('user'),
});

// Define input
export type CheckAuthUseCaseInput = z.infer<typeof checkAuthInputSchema>;

// Define data for the response
export type CheckAuthUseCaseData = User;

// Define the use case
export class CheckAuthUseCase
  implements IUseCase<CheckAuthUseCaseInput, CheckAuthUseCaseData>
{
  // Inject dependencies
  constructor(
    private jsonWebToken: IJsonWebToken,
    private userRepository: IUserRepository,
  ) {}

  // Execute the use case
  async execute(
    input: CheckAuthUseCaseInput,
  ): Promise<UseCaseReponse<CheckAuthUseCaseData>> {
    // Catch any errors
    try {
      // Validate input
      const result = checkAuthInputSchema.safeParse(input);
      if (!result.success) {
        const errorMessage = result.error.issues
          .map((iss) => iss.message)
          .join(', ');
        return failureValidation(errorMessage);
      }
      const { token, roleToCheck } = result.data;

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

      // Check role
      if (user.role !== roleToCheck) {
        return failureUnauthorized('User role does not match');
      }

      // Return the user
      return successOk(user);
    } catch (error) {
      console.log(error);
      return failureUnauthorized('Authentication failed');
    }
  }
}
