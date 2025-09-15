import { uuidv7 } from 'uuidv7';
import z from 'zod';
import { EntityValidationError } from './entity.error.js';

// Define postSchema
const postSchema = z.object({
  id: z.uuid({ error: 'ID must be a valid UUID' }),
  title: z.string().min(3, { error: 'Title must be at least 3 characters long' }),
  content: z.string().min(3, { error: 'Content must be at least 3 characters long' }),
  userId: z.uuid({ error: 'User ID must be a valid UUID' }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Define props for creation, omitting auto-generated fields
type PostProps = Omit<z.infer<typeof postSchema>, 'id' | 'createdAt' | 'updatedAt'>;

// Define Post class
export class Post {
  public readonly id: string;
  public title: string;
  public content: string;
  public readonly userId: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: PostProps, id?: string) {
    this.id = id ?? uuidv7();
    this.title = props.title;
    this.content = props.content;
    this.userId = props.userId;

    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;

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
