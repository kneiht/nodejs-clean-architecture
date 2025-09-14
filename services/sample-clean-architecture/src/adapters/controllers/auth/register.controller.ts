import { Request, Response } from 'express';
import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import {
  RegisterUseCaseInput,
  RegisterUseCaseOutput,
} from '@/application/use-cases/auth/register.use-case.js';
import { sendCreated } from '@/presentations/utils/response.js';

export class RegisterController {
  constructor(private registerUseCase: IUseCase<RegisterUseCaseInput, RegisterUseCaseOutput>) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const { email, name, password } = req.body;
    const input = { email, name, password };
    const { user, token } = await this.registerUseCase.execute(input);
    return sendCreated(res, { user, token }, 'Registered successfully');
  }
}
