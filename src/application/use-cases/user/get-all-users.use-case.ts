import { IUseCase } from '@/application/use-cases/index.js';
import { IUserRepository } from '@/application/dependency-interfaces/repositories/user.repository.js';
import { User } from '@/entities/user.entity.js';
import { failureInternal, successOk, UseCaseReponse } from '@/application/use-cases/response.js';

export class GetAllUsersUseCase implements IUseCase<void, User[]> {
  // Inject dependencies
  constructor(private userRepository: IUserRepository) {}

  // Execute the use case
  async execute(): Promise<UseCaseReponse<User[]>> {
    // Catch any errors
    try {
      // Find all users
      const users = await this.userRepository.findAll();

      // Return the users
      return successOk(users);
    } catch (error) {
      // Handle other errors
      console.log(error);
      return failureInternal('An unexpected error occurred while retrieving users.');
    }
  }
}
