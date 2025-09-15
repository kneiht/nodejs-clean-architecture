import jwt from 'jsonwebtoken';
import {
  ExpiresIn,
  IJsonWebToken,
  JwtPayload,
} from '@/application/dependency-interfaces/utils/jwt.js';

export class JsonWebToken implements IJsonWebToken {
  constructor(private readonly secret: string) {}

  async sign(payload: JwtPayload, expiresIn: ExpiresIn): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn } as jwt.SignOptions);
  }

  async verify(token: string): Promise<JwtPayload> {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}
