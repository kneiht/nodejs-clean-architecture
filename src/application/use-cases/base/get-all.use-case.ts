import { IUseCase } from '@/application/use-cases/index.js';
import { IBaseRepository } from '@/application/dependency-interfaces/repositories/base.repository.js';
import {
  failureInternal,
  successOk,
  UseCaseReponse,
} from '@/application/use-cases/response.js';
import { BaseEntity } from '@/entities/base.entity.js';

export class GetAllUseCase implements IUseCase<void> {
  constructor(private repository: IBaseRepository<BaseEntity>) {}

  async execute(): Promise<UseCaseReponse<BaseEntity[]>> {
    try {
      const entities = await this.repository.findAll();
      return successOk(entities);
    } catch (error) {
      console.error(error);
      return failureInternal(`Failed to retrieve`);
    }
  }
}
