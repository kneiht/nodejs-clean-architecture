import { Request, Response } from 'express';
import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import { User } from '@/entities/user.entity.js';
import { sendSuccess } from '@/presentations/utils/response.js';

export class UserListingController {
  constructor(private getAllUsersUseCase: IUseCase<void, User[]>) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const users = await this.getAllUsersUseCase.execute();
    return sendSuccess(res, users);
  }
}
