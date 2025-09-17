import z from 'zod';
import { IUseCase } from '@/application/use-cases/index.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import {
  failureInternal,
  failureNotFound,
  failureValidation,
  successNoContent,
  UseCaseReponse,
} from '@/application/use-cases/response.js';

// Define input schema
const deleteUserInputSchema = z.object({
  id: z.string().min(1, { error: 'User ID cannot be empty' }),
});

// Define input
export type DeleteUserUseCaseInput = z.infer<typeof deleteUserInputSchema>;

// Define the use case
export class DeleteUserUseCase implements IUseCase<DeleteUserUseCaseInput, void> {
  // Inject dependencies
  constructor(private userRepository: IUserRepository) {}

  // Execute the use case
  async execute(input: DeleteUserUseCaseInput): Promise<UseCaseReponse<void>> {
    // Catch any errors
    try {
      // Validate input
      const result = deleteUserInputSchema.safeParse(input);
      if (!result.success) {
        return failureValidation(result.error.issues.map((iss) => iss.message).join(', '));
      }
      const { id } = result.data;

      // Find the user to delete
      const user = await this.userRepository.findById(id);
      if (!user) {
        return failureNotFound(`User with id ${id} not found`);
      }

      // Delete the user
      await this.userRepository.delete(user);

      // Return success with no content
      return successNoContent();
    } catch (error) {
      // Handle other errors
      console.log(error);
      return failureInternal('An unexpected error occurred while deleting the user.');
    }
  }
}
