import { Request, Response, NextFunction } from 'express';
import { sendUnauthorized } from '../utils/response.js';
import { CheckAuthUseCase } from '@/application/use-cases/auth/check-auth.use-case.js';
import { User } from '@/entities/user.entity.js';

interface RequestWithUser extends Request {
  user?: User;
}

function extractTokenFromRequest(req: RequestWithUser): string | undefined {
  const authHeader = req.headers.authorization;
  if (!authHeader) return undefined;

  // Check for Bearer token
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
}

export function makeCheckAuthMiddleware(checkAuthUseCase: CheckAuthUseCase) {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = extractTokenFromRequest(req);

    if (!token) {
      return sendUnauthorized(res, 'Access token is missing');
    }

    try {
      const user = await checkAuthUseCase.execute(token);
      req.user = user;
      next();
    } catch (error) {
      return sendUnauthorized(res);
    }
  };
}
