import { User } from '@/entities/user.entity.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { IPasswordHasher } from '@/application/dependency-interfaces/utils/password.js';
import { IUseCase } from '@/application/use-cases/index.js';
import {
  failureInternal,
  failureValidation,
  successCreated,
  UseCaseReponse,
} from '@/application/use-cases/response.js';
import { EntityValidationError } from '@/entities/entity.error.js';

// Define input
export type AddUserUseCaseInput = {
  email: string;
  name: string;
  password: string;
};

// Define data for the response
export type AddUserUseCaseData = User;

// Define the use case
export class AddUserUseCase implements IUseCase<AddUserUseCaseInput, AddUserUseCaseData> {
  // Inject dependencies
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  // Execute the use case
  async execute(input: AddUserUseCaseInput): Promise<UseCaseReponse<AddUserUseCaseData>> {
    // Catch any errors
    try {
      // Check if the user already exists
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser) {
        return failureValidation('User with this email already exists');
      }

      // Create the user
      const user = new User({
        email: input.email,
        name: input.name,
        passwordHash: await this.passwordHasher.hash(input.password),
      });

      // Save the user
      await this.userRepository.add(user);

      // Return the user with the formatted response
      return successCreated(user);
    } catch (error) {
      // Handle validation errors
      if (error instanceof EntityValidationError) {
        return failureValidation(error.message);
      }
      // Handle other errors
      return failureInternal('An unexpected error occurred while creating the user.');
    }
  }
}
