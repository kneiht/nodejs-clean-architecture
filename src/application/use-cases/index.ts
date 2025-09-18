import { UseCaseReponse } from './response.js';

export interface IUseCase<TInput, IData> {
  execute(input: TInput): Promise<UseCaseReponse<IData>>;
}
