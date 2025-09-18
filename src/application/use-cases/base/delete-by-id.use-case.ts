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
import { BaseEntity } from '@/entities/base.entity.js';

// Define the use case
export class DeleteByIdUseCase implements IUseCase<string> {
  constructor(private repository: IBaseRepository<BaseEntity>) {}

  // Execute the use case
  async execute(id: string): Promise<UseCaseReponse<null>> {
    try {
      // Find the entity
      const entity = await this.repository.findById(id);
      if (!entity) {
        return failureNotFound(`Not found`);
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
      return failureInternal(`Failed to delete`);
    }
  }
}
