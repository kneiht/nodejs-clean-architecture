import z from 'zod';
import { EntityValidationError } from './entity.error.js';
import { IEntityStaticMethods } from './entity.interface.js';

// Define param schemas
const idSchema = z.string({ error: 'ID must be a string' });
const titleSchema = z
  .string('Title must be a string')
  .min(3, { error: 'Title must be at least 3 characters long' });
const contentSchema = z
  .string('Content must be a string')
  .min(3, { error: 'Content must be at least 3 characters long' });

// Internal validation schema for the entity's properties
const postSchema = z.object({
  id: idSchema,
  title: titleSchema,
  content: contentSchema,
  userId: idSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Define create input schema
export const createPostInputSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  userId: idSchema,
});

// Define hydrate input schema
export const hydratePostInputSchema = postSchema;

// Infer types
export type PostType = z.infer<typeof postSchema>;
export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type HydratePostInput = z.infer<typeof hydratePostInputSchema>;

// Define Post class
export class Post {
  public readonly id: string;
  public title: string;
  public content: string;
  public readonly userId: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: PostType) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    // Validate
    this.validate();
  }

  public validate(): void {
    const result = postSchema.safeParse(this);
    if (!result.success) {
      throw new EntityValidationError(result.error.issues.map((iss) => iss.message).join(', '));
    }
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static create(props: CreatePostInput, idGenerator: () => string): Post {
    // Validate input
    const validationResult = createPostInputSchema.safeParse(props);
    if (!validationResult.success) {
      throw new EntityValidationError(
        validationResult.error.issues.map((iss) => iss.message).join(', '),
      );
    }

    const id = idGenerator();
    return new Post({
      id,
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static hydrate(props: HydratePostInput): Post {
    const validationResult = hydratePostInputSchema.safeParse(props);
    if (!validationResult.success) {
      throw new EntityValidationError(
        validationResult.error.issues.map((iss) => iss.message).join(', '),
      );
    }
    return new Post(props);
  }
}
