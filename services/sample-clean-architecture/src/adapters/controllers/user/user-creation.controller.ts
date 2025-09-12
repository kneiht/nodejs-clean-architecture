import { Request, Response } from 'express';
import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import {
  AddUserUseCaseInput,
  AddUserUseCaseOutput,
} from '@/application/use-cases/user/add.use-case.js';

export class UserCreationController {
  constructor(private addUserUseCase: IUseCase<AddUserUseCaseInput, AddUserUseCaseOutput>) {}

  async execute(req: Request, res: Response) {
    const { email, name, password } = req.body;
    const input = {
      email,
      name,
      password,
    };
    const user = await this.addUserUseCase.execute(input);
    return res.status(201).json(user);
  }
}
