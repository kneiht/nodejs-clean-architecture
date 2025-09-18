/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodType } from 'zod';
import { IUseCase } from '@/application/use-cases/index.js';
import { IBaseRepository } from '@/application/dependency-interfaces/repositories/base.repository.js';
import {
  failureInternal,
  failureNotFound,
  failureValidation,
  successOk,
  UseCaseReponse,
} from '@/application/use-cases/response.js';
import { EntityValidationError } from '@/entities/entity.error.js';
import { InputValidationError } from '../use-case.error.js';

// Define the use case
export class UpdateUseCase<TEntity, TInput extends { id: string }>
  implements IUseCase<TInput, TEntity>
{
  constructor(
    private repository: IBaseRepository<TEntity>,
    private validationSchema: ZodType<TInput>,
    private hydrateEntity: (input: TInput) => TEntity,
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
    return validationResult.data as TInput & { id: string };
  }

  // Execute the use case
  async execute(input: TInput): Promise<UseCaseReponse<TEntity>> {
    try {
      // Handle input before execution
      const { id, ...updatePayload } = await this.handleInput(input);

      // Fetch the existing entity
      const entity = await this.repository.findById(id);
      if (!entity) {
        return failureNotFound(`${this.entityName} with id ${id} not found`);
      }

      // Update the entity and validate
      Object.assign(entity, updatePayload);
      (entity as any).updatedAt = new Date();
      (entity as any).validate();

      // Save the updated entity
      const updatedEntity = await this.repository.update(entity);

      // Return success response
      return successOk(updatedEntity);
    } catch (error) {
      console.error(error);
      if (error instanceof EntityValidationError) {
        return failureValidation(error.message);
      }
      if (error instanceof InputValidationError) {
        return failureValidation(error.message);
      }
      return failureInternal(`Failed to update the ${this.entityName}.`);
    }
  }
}
