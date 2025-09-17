export type JwtPayload = {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
};

export enum ExpiresIn {
  ONE_HOUR = '1h',
  SEVEN_DAYS = '7d',
}

export interface IJsonWebToken {
  sign(payload: JwtPayload, expiresIn: ExpiresIn): Promise<string>;
  verify(token: string): Promise<JwtPayload>;
}
