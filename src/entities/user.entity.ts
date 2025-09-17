import { uuidv7 } from 'uuidv7';
import z from 'zod';
import { EntityValidationError } from './entity.error.js';

// Define userSchema
const userSchema = z.object({
  id: z.string({ error: 'ID must be a string' }).optional(),
  name: z
    .string('Name must be a string')
    .min(3, { error: 'Name must be at least 3 characters long' })
    .optional(),
  email: z.email({ error: 'Invalid email format' }),
  passwordHash: z.string('Password hash must be a string').min(1, 'Password hash cannot be empty'),
  role: z.enum(['admin', 'user'], { error: 'Role must be either admin or user' }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type UserType = z.infer<typeof userSchema>;

// Define User class
export class User {
  public readonly id: string;
  public email: string;
  public name?: string;
  public role: 'admin' | 'user';
  private passwordHash: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: UserType) {
    this.id = props.id ?? uuidv7();
    this.email = props.email;
    this.name = props.name;
    this.role = props.role;
    this.passwordHash = props.passwordHash;
    const now = new Date();
    this.createdAt = props.createdAt ?? now;
    this.updatedAt = props.updatedAt ?? now;

    // Validate
    this.validate();
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  validate(): void {
    const result = userSchema.safeParse(this);
    if (!result.success) {
      throw new EntityValidationError(result.error.issues.map((iss) => iss.message).join(', '));
    }
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
