import { User, CreateUserInput } from '@/entities/user.entity.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { IUseCase } from '../index.js';
import {
  failureConflict,
  failureInternal,
  failureValidation,
  successCreated,
  UseCaseReponse,
} from '../response.js';
import { EntityValidationError } from '@/entities/entity.error.js';

// Define the use case for adding a user
export class AddUserUseCase implements IUseCase<CreateUserInput> {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<UseCaseReponse<User>> {
    try {
      // Check if user with the same email already exists
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser) {
        return failureConflict('User with this email already exists');
      }

      // Check if user with the same name already exists
      if (input.name) {
        const existingUserWithSameName = await this.userRepository.findByName(
          input.name,
        );
        if (existingUserWithSameName) {
          return failureConflict('User with this name already exists');
        }
      }

      // Create the user
      const user = await User.create(input);

      // Add to Repository
      const newUser = await this.userRepository.add(user);

      // Return Success Response
      return successCreated(newUser);
    } catch (error) {
      if (error instanceof EntityValidationError) {
        return failureValidation(error.message);
      }
      return failureInternal('Failed to create user');
    }
  }
}
