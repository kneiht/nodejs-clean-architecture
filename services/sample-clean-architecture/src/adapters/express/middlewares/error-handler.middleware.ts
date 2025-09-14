import { Request, Response, NextFunction } from 'express';
import { sendServerError } from '../utils/response.js';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  sendServerError(res, err.message);
}
