import { uuidv7 } from 'uuidv7';
import z from 'zod';
import { EntityValidationError } from './entity.error.js';

// Define userSchema
const userSchema = z.object({
  id: z.uuid({ error: 'ID must be a valid UUID' }),
  name: z.string().min(3, { error: 'Name must be at least 3 characters long' }),
  email: z.email({ error: 'Invalid email format' }),
  passwordHash: z.string().min(1, 'Password hash cannot be empty'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Define User class
export class User {
  public readonly id: string;
  public email: string;
  public name: string;
  private passwordHash: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    props: Omit<z.infer<typeof userSchema>, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    this.id = id ?? uuidv7();
    this.email = props.email;
    this.name = props.name;
    this.passwordHash = props.passwordHash;
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;

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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
