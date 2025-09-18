import { ZodType } from 'zod';
import { IUseCase } from '@/application/use-cases/index.js';
import { IBaseRepository } from '@/application/dependency-interfaces/repositories/base.repository.js';
import {
  failureInternal,
  failureValidation,
  successCreated,
  UseCaseReponse,
} from '@/application/use-cases/response.js';
import { EntityValidationError } from '@/entities/entity.error.js';
import { InputValidationError } from '../use-case.error.js';

// Define the use case
export class AddUseCase<TEntity, TInput> implements IUseCase<TInput, TEntity> {
  constructor(
    private repository: IBaseRepository<TEntity>,
    private validationSchema: ZodType<TInput>,
    private createEntity: (input: TInput) => Promise<TEntity> | TEntity,
    private entityName: string = 'Entity',
  ) {}

  // Handle input validation
  protected async handleInput(input: TInput): Promise<TInput> {
    const validationResult = this.validationSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues
        .map((iss) => iss.message)
        .join(', ');
      throw new InputValidationError(errorMessage);
    }
    return validationResult.data;
  }

  async execute(input: TInput): Promise<UseCaseReponse<TEntity>> {
    try {
      // Handle input before execution
      const handledInput = await this.handleInput(input);

      // Create the entity
      const entity = await this.createEntity(handledInput);

      // Add to Repository
      const newEntity = await this.repository.add(entity);

      // Return Success Response
      return successCreated(newEntity);
    } catch (error) {
      console.error(error);
      if (error instanceof EntityValidationError) {
        return failureValidation(error.message);
      }
      if (error instanceof InputValidationError) {
        return failureValidation(error.message);
      }
      return failureInternal(`Failed to create the ${this.entityName}.`);
    }
  }
}
