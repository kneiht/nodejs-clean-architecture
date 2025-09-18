import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`\n${req.method} ${req.url} ${res.statusCode}`);
  console.log(`Body: ${req.body}`);
  next();
}
