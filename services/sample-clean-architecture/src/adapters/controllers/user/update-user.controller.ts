import { Request, Response } from 'express';
import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import { User } from '@/entities/user.entity.js';
import { UpdateUserUseCaseInput } from '@/application/use-cases/user/update-user.use-case.js';
import { sendSuccess } from '@/presentations/utils/response.js';

export class UpdateUserController {
  constructor(private updateUserUseCase: IUseCase<UpdateUserUseCaseInput, User>) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updateData = req.body;
    const user = await this.updateUserUseCase.execute({ id, ...updateData });
    return sendSuccess(res, user);
  }
}
