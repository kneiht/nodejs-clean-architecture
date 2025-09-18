/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { BaseEntity } from '@/entities/base.entity.js';

// Define the use case
export class UpdateUseCase<T extends { id: string }> implements IUseCase<T> {
  constructor(private repository: IBaseRepository<BaseEntity>) {}

  // Execute the use case
  async execute(input: T): Promise<UseCaseReponse<BaseEntity>> {
    try {
      const { id, ...updatePayload } = input;

      // Fetch the existing entity
      const entity = await this.repository.findById(id);
      if (!entity) {
        return failureNotFound(`Not found`);
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
      return failureInternal(`Failed to update`);
    }
  }
}
