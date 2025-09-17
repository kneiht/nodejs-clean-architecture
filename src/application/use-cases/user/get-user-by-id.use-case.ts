import z from 'zod';
import { IUseCase } from '@/application/use-cases/index.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { User } from '@/entities/user.entity.js';
import {
  failureInternal,
  failureNotFound,
  failureValidation,
  successOk,
  UseCaseReponse,
} from '@/application/use-cases/response.js';

// Define input schema
const getUserByIdInputSchema = z.object({
  id: z.string().min(1, { error: 'User ID cannot be empty' }),
});

// Define input
export type GetUserByIdUseCaseInput = z.infer<typeof getUserByIdInputSchema>;

// Define data for the response
export type GetUserByIdUseCaseData = User | null;

// Define the use case
export class GetUserByIdUseCase
  implements IUseCase<GetUserByIdUseCaseInput, GetUserByIdUseCaseData>
{
  // Inject dependencies
  constructor(private userRepository: IUserRepository) {}

  // Execute the use case
  async execute(input: GetUserByIdUseCaseInput): Promise<UseCaseReponse<GetUserByIdUseCaseData>> {
    // Catch any errors
    try {
      // Validate input
      const result = getUserByIdInputSchema.safeParse(input);
      if (!result.success) {
        return failureValidation(result.error.issues.map((iss) => iss.message).join(', '));
      }
      const { id } = result.data;

      // Find the user by ID
      const user = await this.userRepository.findById(id);

      // If user not found, return error
      if (!user) {
        return failureNotFound(`User with id ${id} not found`);
      }

      // Return the user
      return successOk(user);
    } catch (error) {
      // Handle other errors
      console.log(error);
      return failureInternal('An unexpected error occurred while retrieving the user.');
    }
  }
}
