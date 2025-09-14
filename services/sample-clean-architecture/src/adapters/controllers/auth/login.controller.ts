import { Request, Response } from 'express';
import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import {
  LoginUseCaseInput,
  LoginUseCaseOutput,
} from '@/application/use-cases/auth/login.use-case.js';
import { sendSuccess } from '@/presentations/utils/response.js';

export class LoginController {
  constructor(private loginUseCase: IUseCase<LoginUseCaseInput, LoginUseCaseOutput>) {}

  async execute(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const output = await this.loginUseCase.execute({ email, password });
    return sendSuccess(res, output, 'Login successfully');
  }
}
