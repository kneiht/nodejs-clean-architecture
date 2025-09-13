import { Request, Response } from 'express';
import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import { User } from '@/entities/user.entity.js';
import { GetUserByIdUseCaseInput } from '@/application/use-cases/user/get-user-by-id.use-case.js';
import { sendSuccess } from '@/presentations/utils/response.js';

export class UserDetailsController {
  constructor(private getUserByIdUseCase: IUseCase<GetUserByIdUseCaseInput, User>) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const user = await this.getUserByIdUseCase.execute({ id });
    return sendSuccess(res, user);
  }
}
