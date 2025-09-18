import { IUseCase } from '@/application/use-cases/index.js';
import { ErrorType, SuccessType } from '@/application/use-cases/response.js';
import { Request, Response } from 'express';

// Extract request data
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

  // Return the request data in a single object to be used by the use case
  return { ...body, ...query, ...params, token };
}

// Status code converter
export function statusCodeConverter(
  useCaseResponseType: ErrorType | SuccessType | undefined,
) {
  switch (useCaseResponseType) {
    case ErrorType.VALIDATION:
      return 400;
    case ErrorType.NOT_FOUND:
      return 404;
    case ErrorType.UNAUTHORIZED:
      return 401;
    case ErrorType.FORBIDDEN:
      return 403;
    case ErrorType.INTERNAL:
      return 500;
    default:
      return 200;
  }
}

// Define a basic controller for use cases
export function basicController<UseCaseInput, UseCaseData>(
  useCase: IUseCase<UseCaseInput, UseCaseData>,
) {
  return async (req: Request, res: Response) => {
    try {
      const input = extractor(req);
      const output = await useCase.execute(input);
      res.status(statusCodeConverter(output.type)).json(output);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      res.status(500).json({ success: false, message: errorMessage });
    }
  };
}
