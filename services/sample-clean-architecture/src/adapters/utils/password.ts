import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '@/application/dependency-interfaces/utils/password.js';

export class PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
