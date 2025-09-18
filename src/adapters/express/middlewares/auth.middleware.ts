import { Request, Response, NextFunction } from 'express';
import { CheckAuthUseCase } from '@/application/use-cases/auth/check-auth.use-case.js';
import { statusCodeConverter } from '../controller.js';
import { User } from '@/entities/user.entity.js';

function extractTokenFromRequest(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (!authHeader) return undefined;

  // Check for Bearer token
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
}

// Define the middleware factory
export function makeCheckAuthMiddleware(
  checkAuthUseCase: CheckAuthUseCase,
  roleToCheck: User['role'],
) {
  // Return the middleware
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the token from the request
      const token = extractTokenFromRequest(req) as string;

      // Get the user from the use case
      const output = await checkAuthUseCase.execute({ token, roleToCheck });

      // If the user is found, set it to the request and continue
      if (output.success) {
        req.user = output.data;
        return next();
      } else {
        // The response in the output of the use case has already handled errors
        return res.status(statusCodeConverter(output.type)).json(output);
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  };
}
