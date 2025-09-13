import { Request, Response } from 'express';
import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import {
  AddUserUseCaseInput,
  AddUserUseCaseOutput,
} from '@/application/use-cases/user/add-user.use-case.js';
import { sendCreated } from '@/presentations/utils/response.js';

export class AddUserController {
  constructor(private addUserUseCase: IUseCase<AddUserUseCaseInput, AddUserUseCaseOutput>) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const { email, name, password } = req.body;
    const input = { email, name, password };
    const user = await this.addUserUseCase.execute(input);
    return sendCreated(res, user);
  }
}
