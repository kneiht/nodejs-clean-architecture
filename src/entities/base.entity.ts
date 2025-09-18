/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ZodType } from 'zod';
import { EntityValidationError } from './entity.error.js';
import { uuidv7 } from 'uuidv7';
import { hash } from '@/shared/password.js';

export abstract class BaseEntity {
  protected abstract schema: ZodType;
  protected constructor(...args: any[]) {}

  validate(): void {
    const result = this.schema.safeParse(this);
    if (!result.success) {
      throw new EntityValidationError(
        result.error.issues.map((iss) => iss.message).join(', '),
      );
    }
  }

  public abstract toJSON(): any;

  static idGenerator(): string {
    return uuidv7();
  }
  static passwordHasher(password: string): Promise<string> {
    return hash(password);
  }

  static create(...args: any[]): any {}
  static hydrate(...args: any[]): any {}
}
