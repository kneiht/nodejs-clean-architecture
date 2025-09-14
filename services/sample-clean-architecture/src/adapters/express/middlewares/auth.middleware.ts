import { Request, Response, NextFunction } from 'express';
import { CheckAuthUseCase } from '@/application/use-cases/auth/check-auth.use-case.js';
import { statusCodeConverter } from '../controller.js';

function extractTokenFromRequest(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (!authHeader) return undefined;

  // Check for Bearer token
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
}

// Define the middleware factory
export function makeCheckAuthMiddleware(checkAuthUseCase: CheckAuthUseCase) {
  // Return the middleware
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the token from the request
      const token = extractTokenFromRequest(req);

      // Get the user from the use case
      const output = await checkAuthUseCase.execute(token);

      // If the user is found, set it to the request and continue
      if (output.success) {
        req.user = output.data;
        next();
      } else {
        return res.status(statusCodeConverter(output.type)).json(output);
      }
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  };
}
