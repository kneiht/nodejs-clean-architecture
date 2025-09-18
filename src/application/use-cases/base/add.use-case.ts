import { IUseCase } from '@/application/use-cases/index.js';
import { IBaseRepository } from '@/application/dependency-interfaces/repositories/base.repository.js';
import {
  failureInternal,
  failureValidation,
  successCreated,
  UseCaseReponse,
} from '@/application/use-cases/response.js';
import { EntityValidationError } from '@/entities/entity.error.js';
import { BaseEntity } from '@/entities/base.entity.js';

// Define the use case
export class AddUseCase<T> implements IUseCase<T> {
  constructor(
    private entityStaticMethods: typeof BaseEntity,
    private repository: IBaseRepository<BaseEntity>,
  ) {}

  async execute(input: T): Promise<UseCaseReponse<BaseEntity>> {
    try {
      // Create the entity
      const entity = await this.entityStaticMethods.create(input);

      // Add to Repository
      const newEntity = await this.repository.add(entity);

      // Return Success Response
      return successCreated(newEntity);
    } catch (error) {
      console.error(error);
      if (error instanceof EntityValidationError) {
        return failureValidation(error.message);
      }
      return failureInternal(`Failed to create`);
    }
  }
}
