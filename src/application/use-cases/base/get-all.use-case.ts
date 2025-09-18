import { IUseCase } from '@/application/use-cases/index.js';
import { IBaseRepository } from '@/application/dependency-interfaces/repositories/base.repository.js';
import { failureInternal, successOk, UseCaseReponse } from '@/application/use-cases/response.js';

export class GetAllUseCase<T> implements IUseCase<void, T[]> {
  constructor(
    private repository: IBaseRepository<T>,
    private entityName: string = 'Entity',
  ) {}

  async execute(): Promise<UseCaseReponse<T[]>> {
    try {
      const entities = await this.repository.findAll();
      return successOk(entities);
    } catch (error) {
      console.error(error);
      return failureInternal(`Failed to retrieve ${this.entityName}s.`);
    }
  }
}
