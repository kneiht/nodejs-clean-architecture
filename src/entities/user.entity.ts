import z from 'zod';
import { EntityValidationError } from './entity.error.js';
import { BaseEntity } from './base.entity.js';

// Define param schemas
const idSchema = z.string('ID must be a string');
const nameSchema = z
  .string('Name must be a string')
  .min(3, 'Name must be at least 3 characters long');
const emailSchema = z.email('Invalid email format');
const passwordHashSchema = z
  .string('Password hash must be a string')
  .min(1, 'Password hash cannot be empty');
const roleSchema = z.enum(
  ['admin', 'user'],
  'Role must be either admin or user',
);
const password = z
  .string('Password must be a string')
  .min(6, 'Password must be at least 6 characters long');

// Define userSchema
const userSchema = z.object({
  id: idSchema,
  email: emailSchema,
  name: nameSchema.optional(),
  passwordHash: passwordHashSchema,
  role: roleSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Define create input schema
export const createUserInputSchema = z.object({
  email: emailSchema,
  name: nameSchema.optional(),
  role: roleSchema.optional(),
  password: password,
});

// Define update input schema
export const updateUserInputSchema = z.object({
  id: idSchema,
  name: nameSchema.optional(),
  role: roleSchema.optional(),
});

// Define hydrate input schema
export const hydrateUserInputSchema = userSchema;

// Infer types
export type UserType = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type HydrateUserInput = z.infer<typeof hydrateUserInputSchema>;

// Define User class
export class User extends BaseEntity {
  public readonly id: string;
  public email: string;
  public name?: string;
  public role: 'admin' | 'user';
  private passwordHash: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  public schema = userSchema;

  protected constructor(props: UserType) {
    super();
    this.id = props.id;
    this.email = props.email;
    this.name = props.name;
    this.role = props.role;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    // Validate
    this.validate();
  }

  getPasswordHash(): string {
    return this.passwordHash;
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

  static async create(props: CreateUserInput): Promise<User> {
    // Validate input
    const result = createUserInputSchema.safeParse(props);
    if (!result.success) {
      throw new EntityValidationError(
        result.error.issues.map((iss) => iss.message).join(', '),
      );
    }

    // Generate ID and hash password
    const id = this.idGenerator();
    const passwordHash = await this.passwordHasher(props.password);
    return new User({
      id,
      email: props.email,
      name: props.name,
      role: props.role ?? 'user',
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static hydrate(props: HydrateUserInput): User {
    // Validate input
    const result = hydrateUserInputSchema.safeParse(props);
    if (!result.success) {
      throw new EntityValidationError(
        result.error.issues.map((iss) => iss.message).join(', '),
      );
    }
    return new User(props);
  }
}
