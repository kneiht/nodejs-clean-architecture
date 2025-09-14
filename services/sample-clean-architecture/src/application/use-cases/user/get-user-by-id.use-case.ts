import { IUseCase } from '@/application/use-cases/index.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { User } from '@/entities/user.entity.js';
import {
  failureInternal,
  failureNotFound,
  successOk,
  UseCaseReponse,
} from '@/application/use-cases/response.js';

// Define input
export type GetUserByIdUseCaseInput = {
  id: string;
};

// Define data for the response
export type GetUserByIdUseCaseData = User | null;

// Define the use case
export class GetUserByIdUseCase
  implements IUseCase<GetUserByIdUseCaseInput, GetUserByIdUseCaseData>
{
  // Inject dependencies
  constructor(private userRepository: IUserRepository) {}

  // Execute the use case
  async execute({ id }: GetUserByIdUseCaseInput): Promise<UseCaseReponse<GetUserByIdUseCaseData>> {
    // Catch any errors
    try {
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
      return failureInternal('An unexpected error occurred while retrieving the user.');
    }
  }
}
