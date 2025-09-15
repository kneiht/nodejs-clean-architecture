import z from 'zod';
import { IUseCase } from '@/application/use-cases/index.js';
import { IPostRepository } from '@/application/dependency-interfaces/repositories/post.repository.js';
import { Post } from '@/entities/post.entity.js';
import {
  failureInternal,
  failureNotFound,
  failureValidation,
  successOk,
  UseCaseReponse,
} from '@/application/use-cases/response.js';
import { EntityValidationError } from '@/entities/entity.error.js';

// Define input schema
const updatePostInputSchema = z.object({
  id: z.string().min(1, { message: 'Post ID cannot be empty' }),
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }).optional(),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters long' })
    .optional(),
});

// Define input
export type UpdatePostUseCaseInput = z.infer<typeof updatePostInputSchema>;

// Define data for the response
export type UpdatePostUseCaseData = Post;

// Define the use case
export class UpdatePostUseCase implements IUseCase<UpdatePostUseCaseInput, UpdatePostUseCaseData> {
  // Inject dependencies
  constructor(private postRepository: IPostRepository) {}

  // Execute the use case
  async execute(input: UpdatePostUseCaseInput): Promise<UseCaseReponse<UpdatePostUseCaseData>> {
    // Catch any errors
    try {
      // Validate input
      const result = updatePostInputSchema.safeParse(input);
      if (!result.success) {
        return failureValidation(result.error.issues.map((iss) => iss.message).join(', '));
      }

      const { id, ...updates } = result.data;

      // Find the post to update
      const post = await this.postRepository.findById(id);
      if (!post) {
        return failureNotFound(`Post with id ${id} not found`);
      }

      // Update properties if provided
      if (updates.title) {
        post.title = updates.title;
      }
      if (updates.content) {
        post.content = updates.content;
      }

      // Validate the entity after changes
      post.validate();

      // Save the updated post
      await this.postRepository.update(post);

      // Return the updated post
      return successOk(post);
    } catch (error) {
      // Handle validation errors
      if (error instanceof EntityValidationError) {
        return failureValidation(error.message);
      }
      // Handle other errors
      return failureInternal('An unexpected error occurred while updating the post.');
    }
  }
}
