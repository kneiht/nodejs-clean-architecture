import z from 'zod';
import { IUseCase } from '@/application/use-cases/index.js';
import { IPostRepository } from '@/application/dependency-interfaces/repositories/post.repository.js';
import { Post } from '@/entities/post.entity.js';
import {
  failureInternal,
  failureValidation,
  successCreated,
  UseCaseReponse,
} from '@/application/use-cases/response.js';
import { EntityValidationError } from '@/entities/entity.error.js';

// Define input schema
const addPostInputSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long' }),
  userId: z.string().min(1, { message: 'User ID cannot be empty' }),
});

// Define input
export type AddPostUseCaseInput = z.infer<typeof addPostInputSchema>;

// Define data for the response
export type AddPostUseCaseData = Post;

// Define the use case
export class AddPostUseCase implements IUseCase<AddPostUseCaseInput, AddPostUseCaseData> {
  // Inject dependencies
  constructor(private postRepository: IPostRepository) {}

  // Execute the use case
  async execute(input: AddPostUseCaseInput): Promise<UseCaseReponse<AddPostUseCaseData>> {
    // Catch any errors
    try {
      // Validate input
      const result = addPostInputSchema.safeParse(input);
      if (!result.success) {
        return failureValidation(result.error.issues.map((iss) => iss.message).join(', '));
      }

      const { title, content, userId } = result.data;

      // Create the post
      const post = new Post({
        title,
        content,
        userId,
      });

      // Save the post
      await this.postRepository.add(post);

      // Return the post with the formatted response
      return successCreated(post);
    } catch (error) {
      // Handle validation errors
      if (error instanceof EntityValidationError) {
        return failureValidation(error.message);
      }
      // Handle other errors
      return failureInternal('An unexpected error occurred while creating the post.');
    }
  }
}
