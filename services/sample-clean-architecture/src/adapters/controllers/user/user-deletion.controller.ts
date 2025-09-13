import { Request, Response } from 'express';
import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import { DeleteUserUseCaseInput } from '@/application/use-cases/user/delete-user.use-case.js';
import { sendDeleted } from '@/presentations/utils/response.js';

export class UserDeletionController {
  constructor(private deleteUserUseCase: IUseCase<DeleteUserUseCaseInput, void>) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this.deleteUserUseCase.execute({ id });
    return sendDeleted(res);
  }
}
