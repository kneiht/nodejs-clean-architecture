import jwt from 'jsonwebtoken';
import { IJsonWebToken, JwtPayload } from '@/application/dependency-interfaces/utils/jwt.js';

export class JsonWebToken implements IJsonWebToken {
  constructor(private readonly secret: string) {}

  async sign(payload: JwtPayload, expiresIn: string): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn } as jwt.SignOptions);
  }

  async verify(token: string): Promise<JwtPayload> {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}
