import z from 'zod';
import { ExpiresIn, IJsonWebToken } from '@/application/dependency-interfaces/utils/jwt.js';
import { User } from '@/entities/user.entity.js';
import { IUseCase } from '../index.js';
import { AddUserUseCase } from '../user/add-user.use-case.js';
import {
  failureInternal,
  failureValidation,
  successCreated,
  UseCaseReponse,
} from '@/application/use-cases/response.js';
import { env } from '@/config/environment.js';

// Define input schema
const registerUserInputSchema = z.object({
  email: z.email({ error: 'Invalid email format' }),
  name: z.string().min(3, { error: 'Name must be at least 3 characters long' }).optional(),
  password: z.string().min(6, { error: 'Password must be at least 6 characters long' }),
  role: z.enum(['admin', 'user']).optional().default('user'),
});

// Define input
export type RegisterUseCaseInput = z.infer<typeof registerUserInputSchema>;

// Define data for the response
export type RegisterUseCaseData = {
  user: User;
  token: {
    accessToken: string;
    refreshToken: string;
  };
};

// Define the use case
export class RegisterUseCase implements IUseCase<RegisterUseCaseInput, RegisterUseCaseData> {
  // Inject dependencies
  constructor(
    private addUserUseCase: AddUserUseCase,
    private jsonWebToken: IJsonWebToken,
  ) {}
  // Execute the use case
  async execute(input: RegisterUseCaseInput): Promise<UseCaseReponse<RegisterUseCaseData>> {
    // Catch any errors
    try {
      // Validate input
      const result = registerUserInputSchema.safeParse(input);
      if (!result.success) {
        return failureValidation(result.error.issues.map((iss) => iss.message).join(', '));
      }

      // Use AddUserUseCase to create the user
      const addUserResponse = await this.addUserUseCase.execute(input);

      // If user creation failed
      if (!addUserResponse.success || !addUserResponse.data) {
        const registerResponse = { data: undefined, ...addUserResponse };
        return registerResponse as UseCaseReponse<RegisterUseCaseData>;
      }

      // If successful, create tokens
      const user = addUserResponse.data;
      const payload = { id: user.id, email: user.email, name: user.name, role: user.role };

      // Sign tokens
      const accessToken = await this.jsonWebToken.sign(
        payload,
        env.JWT_ACCESS_EXPIRES_IN as ExpiresIn,
      );
      const refreshToken = await this.jsonWebToken.sign(
        payload,
        env.JWT_REFRESH_EXPIRES_IN as ExpiresIn,
      );

      // Return success response with user and tokens
      return successCreated({
        user,
        token: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      // Handle other errors
      console.log(error);
      return failureInternal('An unexpected error occurred during registration.');
    }
  }
}
