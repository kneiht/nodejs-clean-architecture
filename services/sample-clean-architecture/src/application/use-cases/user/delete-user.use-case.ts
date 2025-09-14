import { IUseCase } from '@/application/use-cases/index.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import {
  failureInternal,
  failureNotFound,
  successNoContent,
  UseCaseReponse,
} from '@/application/use-cases/response.js';

// Define input
export type DeleteUserUseCaseInput = {
  id: string;
};

// Define the use case
export class DeleteUserUseCase implements IUseCase<DeleteUserUseCaseInput, void> {
  // Inject dependencies
  constructor(private userRepository: IUserRepository) {}

  // Execute the use case
  async execute({ id }: DeleteUserUseCaseInput): Promise<UseCaseReponse<void>> {
    // Catch any errors
    try {
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
      return failureInternal('An unexpected error occurred while deleting the user.');
    }
  }
}
