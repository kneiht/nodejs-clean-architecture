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
import { EntityValidationError } from '@/entities/entity.error.js';

// Define input
export type UpdateUserUseCaseInput = {
  id: string;
  name?: string;
  email?: string;
};

// Define data for the response
export type UpdateUserUseCaseData = User | null;

// Define the use case
export class UpdateUserUseCase implements IUseCase<UpdateUserUseCaseInput, UpdateUserUseCaseData> {
  // Inject dependencies
  constructor(private userRepository: IUserRepository) {}

  // Execute the use case
  async execute(input: UpdateUserUseCaseInput): Promise<UseCaseReponse<UpdateUserUseCaseData>> {
    // Catch any errors
    try {
      const { id, ...updates } = input;

      // Find the user to update
      const user = await this.userRepository.findById(id);
      if (!user) {
        return failureNotFound(`User with id ${id} not found`);
      }

      // Update properties if provided
      if (updates.name) {
        user.name = updates.name;
      }
      if (updates.email) {
        // Check if the new email is already in use
        const existingUser = await this.userRepository.findByEmail(updates.email);
        if (existingUser && existingUser.id !== id) {
          return failureValidation('Email already in use by another account');
        }
        user.email = updates.email;
      }

      // Validate the entity after changes
      user.validate();

      // Save the updated user
      await this.userRepository.update(user);

      // Return the updated user
      return successOk(user);
    } catch (error) {
      // Handle validation errors
      if (error instanceof EntityValidationError) {
        return failureValidation(error.message);
      }
      // Handle other errors
      return failureInternal('An unexpected error occurred while updating the user.');
    }
  }
}
