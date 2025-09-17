import { uuidv7 } from 'uuidv7';
import z from 'zod';
import { EntityValidationError } from './entity.error.js';

// Define postSchema
const postSchema = z.object({
  id: z.string({ error: 'ID must be a string' }).optional(),
  title: z
    .string('Title must be a string')
    .min(3, { error: 'Title must be at least 3 characters long' }),
  content: z
    .string('Content must be a string')
    .min(3, { error: 'Content must be at least 3 characters long' }),
  userId: z.uuid({ error: 'User ID must be a valid UUID' }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Define props for creation, omitting auto-generated fields
export type PostType = z.infer<typeof postSchema>;

// Define Post class
export class Post {
  public readonly id: string;
  public title: string;
  public content: string;
  public readonly userId: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: PostType) {
    this.id = props.id ?? uuidv7();
    this.title = props.title;
    this.content = props.content;
    this.userId = props.userId;

    const now = new Date();
    this.createdAt = props.createdAt ?? now;
    this.updatedAt = props.updatedAt ?? now;

    // Validate
    this.validate();
  }

  validate(): void {
    const result = postSchema.safeParse(this);
    if (!result.success) {
      throw new EntityValidationError(result.error.issues.map((iss) => iss.message).join(', '));
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
