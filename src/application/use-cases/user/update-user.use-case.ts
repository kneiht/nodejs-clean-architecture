/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, UpdateUserInput } from '@/entities/user.entity.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { IUseCase } from '@/application/use-cases/index.js';
import {
  failureConflict,
  failureInternal,
  failureNotFound,
  failureValidation,
  successOk,
  UseCaseReponse,
} from '@/application/use-cases/response.js';
import { EntityValidationError } from '@/entities/entity.error.js';

// Define the use case
export class UpdateUserUseCase implements IUseCase<UpdateUserInput> {
  constructor(private userRepository: IUserRepository) {}

  // Execute the use case
  async execute(input: UpdateUserInput): Promise<UseCaseReponse<User>> {
    try {
      const { id, ...updatePayload } = input;

      // Fetch the existing entity
      const user = await this.userRepository.findById(id);
      if (!user) {
        return failureNotFound(`User with ID ${id} not found`);
      }

      // Check if user with the same name
      if (updatePayload.name) {
        const existingUserWithSameName = await this.userRepository.findByName(
          updatePayload.name,
        );
        if (existingUserWithSameName && existingUserWithSameName.id !== id) {
          return failureConflict('User with this name already exists');
        }
      }

      // Update the entity and validate
      Object.assign(user, updatePayload);
      user.updatedAt = new Date();
      user.validate();

      // Save the updated entity
      const updatedEntity = await this.userRepository.update(user);

      // Return success response
      return successOk(updatedEntity);
    } catch (error) {
      console.error(error);
      if (error instanceof EntityValidationError) {
        return failureValidation(error.message);
      }
      return failureInternal(`Failed to update`);
    }
  }
}
