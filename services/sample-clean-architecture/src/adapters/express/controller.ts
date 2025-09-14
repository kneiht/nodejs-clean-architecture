import { IUseCase } from '@/application/use-cases/use-case.interface.js';
import { Request, Response, NextFunction } from 'express';

export interface AdvancedRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  locals: any;
}

export function extractor(req: Request) {
  const params = req.params;
  const query = req.query;
  const body = req.body;
  const headers = req.headers;

  // Get token from headers
  const authHeader = headers.authorization;
  let token = null;
  if (!authHeader) {
    token = null;
  } else {
    if (!authHeader.startsWith('Bearer ')) {
      token = null;
    } else {
      token = authHeader.split(' ')[1];
    }
  }

  return { ...params, ...query, ...body, token };
}

export function basicController<UseCaseInput, UseCaseOutput>(
  useCase: IUseCase<UseCaseInput, UseCaseOutput>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const input = extractor(req);
    try {
      const output = await useCase.execute(input);
      req.locals = output;
      return res.status(200).json(output);
    } catch (error) {
      next(error);
    }
  };
}

// export function authCheckController<UseCaseInput, UseCaseOutput>(
//   useCase: IUseCase<UseCaseInput, UseCaseOutput>,
// ) {
//   return async (req: Request, res: Response) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return sendUnauthorized(res, 'Token not provided');
//     }

//     const token = authHeader.split(' ')[1];
//     const user = await useCase.execute(token);

//     if (!user) {
//       return sendUnauthorized(res, 'Invalid token');
//     }

//     return sendSuccess(res, user);
//   };
// }
