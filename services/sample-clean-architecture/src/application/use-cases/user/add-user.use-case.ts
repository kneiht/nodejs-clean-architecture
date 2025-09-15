import z from 'zod';
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

// Define input schema
const addUserInputSchema = z.object({
  email: z.email({ error: 'Invalid email format' }),
  name: z.string().min(3, { error: 'Name must be at least 3 characters long' }),
  password: z.string().min(6, { error: 'Password must be at least 6 characters long' }),
  role: z.enum(['admin', 'user']).optional().default('user'),
});

// Define input
export type AddUserUseCaseInput = z.infer<typeof addUserInputSchema>;

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
      // Validate input
      const result = addUserInputSchema.safeParse(input);
      if (!result.success) {
        return failureValidation(result.error.issues.map((iss) => iss.message).join(', '));
      }

      const { email, name, password, role } = result.data;

      // Check if the user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return failureValidation('User with this email already exists');
      }

      // Create the user
      const user = new User({
        email,
        name,
        role: role ?? 'user',
        passwordHash: await this.passwordHasher.hash(password),
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
