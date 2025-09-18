import { UseCaseReponse } from './response.js';

export interface IUseCase<TInput> {
  execute(input: TInput): Promise<UseCaseReponse<unknown>>;
}

export * from './base/add.use-case.js';
export * from './base/get-all.use-case.js';
export * from './base/get-by-id.use-case.js';
export * from './base/update.use-case.js';
export * from './base/delete-by-id.use-case.js';

export * from './auth/register.use-case.js';
export * from './auth/login.use-case.js';
