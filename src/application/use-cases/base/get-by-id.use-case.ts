import z from 'zod';
import { IUseCase } from '@/application/use-cases/index.js';
import { IBaseRepository } from '@/application/dependency-interfaces/repositories/base.repository.js';
import {
  failureInternal,
  failureNotFound,
  failureValidation,
  successOk,
  UseCaseReponse,
} from '@/application/use-cases/response.js';
import { InputValidationError } from '../use-case.error.js';

// Define input schema
const getByIdInputSchema = z.object({
  id: z.string().min(1, { message: 'ID cannot be empty' }),
});

// Infer input type from schema
export type GetByIdUseCaseInput = z.infer<typeof getByIdInputSchema>;

// Define the use case
export class GetByIdUseCase<T> implements IUseCase<GetByIdUseCaseInput, T | null> {
  constructor(
    private repository: IBaseRepository<T>,
    private entityName: string = 'Entity',
  ) {}

  // Handle input validation
  protected async handleInput(input: GetByIdUseCaseInput): Promise<GetByIdUseCaseInput> {
    const validationResult = getByIdInputSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues.map((iss) => iss.message).join(', ');
      throw new InputValidationError(errorMessage);
    }
    return validationResult.data;
  }

  // Execute the use case
  async execute(input: GetByIdUseCaseInput): Promise<UseCaseReponse<T | null>> {
    try {
      // Handle input before execution
      const { id } = await this.handleInput(input);

      // Find the entity by ID
      const entity = await this.repository.findById(id);
      if (!entity) {
        return failureNotFound(`${this.entityName} with id ${id} not found`);
      }

      // Return a success response
      return successOk(entity);
    } catch (error) {
      console.error(error);
      if (error instanceof InputValidationError) {
        return failureValidation(error.message);
      }
      return failureInternal(`Failed to retrieve the ${this.entityName}.`);
    }
  }
}
