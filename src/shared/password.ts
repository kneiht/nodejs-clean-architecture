import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '@/application/dependency-interfaces/utils/password.js';

export function hashSync(password: string): string {
  return bcrypt.hashSync(password, 10);
}
export async function verify(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
export async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export class PasswordHasher implements IPasswordHasher {
  hash = hash;
  verify = verify;
  hashSync = hashSync;
}
