import z from 'zod';
import { IUseCase } from '@/application/use-cases/index.js';
import { IBaseRepository } from '@/application/dependency-interfaces/repositories/base.repository.js';
import {
  failureInternal,
  failureNotFound,
  failureValidation,
  successNoContent,
  UseCaseReponse,
} from '@/application/use-cases/response.js';
import { InputValidationError } from '../use-case.error.js';

// Define input schema
const deleteByIdInputSchema = z.object({
  id: z.string('ID must be a string').min(1, 'ID cannot be empty'),
});

// Infer input type from schema
export type DeleteUseCaseInput = z.infer<typeof deleteByIdInputSchema>;

// Define the use case
export class DeleteUseCase<T> implements IUseCase<DeleteUseCaseInput, null> {
  constructor(
    private repository: IBaseRepository<T>,
    private entityName: string = 'Entity',
  ) {}

  // Handle input validation
  protected async handleInput(
    input: DeleteUseCaseInput,
  ): Promise<DeleteUseCaseInput> {
    const validationResult = deleteByIdInputSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues
        .map((iss) => iss.message)
        .join(', ');
      throw new InputValidationError(errorMessage);
    }
    return validationResult.data;
  }

  // Execute the use case
  async execute(input: DeleteUseCaseInput): Promise<UseCaseReponse<null>> {
    try {
      // Handle input before execution
      const { id } = await this.handleInput(input);

      // Find the entity
      const entity = await this.repository.findById(id);
      if (!entity) {
        return failureNotFound(`${this.entityName} with id ${id} not found.`);
      }

      // Delete the entity
      await this.repository.delete(entity);

      // Return success with no content
      return successNoContent();
    } catch (error) {
      console.error(error);
      if (error instanceof InputValidationError) {
        return failureValidation(error.message);
      }
      return failureInternal(`Failed to delete the ${this.entityName}.`);
    }
  }
}
