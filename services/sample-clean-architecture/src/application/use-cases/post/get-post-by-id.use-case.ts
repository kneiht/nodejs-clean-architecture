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

// Define input schema
const getPostByIdInputSchema = z.object({
  id: z.string().min(1, { message: 'Post ID cannot be empty' }),
});

// Define input
export type GetPostByIdUseCaseInput = z.infer<typeof getPostByIdInputSchema>;

// Define data for the response
export type GetPostByIdUseCaseData = Post | null;

// Define the use case
export class GetPostByIdUseCase
  implements IUseCase<GetPostByIdUseCaseInput, GetPostByIdUseCaseData>
{
  // Inject dependencies
  constructor(private postRepository: IPostRepository) {}

  // Execute the use case
  async execute(input: GetPostByIdUseCaseInput): Promise<UseCaseReponse<GetPostByIdUseCaseData>> {
    // Catch any errors
    try {
      // Validate input
      const result = getPostByIdInputSchema.safeParse(input);
      if (!result.success) {
        return failureValidation(result.error.issues.map((iss) => iss.message).join(', '));
      }
      const { id } = result.data;

      // Find the post by ID
      const post = await this.postRepository.findById(id);

      // If post not found, return error
      if (!post) {
        return failureNotFound(`Post with id ${id} not found`);
      }

      // Return the post
      return successOk(post);
    } catch (error) {
      // Handle other errors
      return failureInternal('An unexpected error occurred while retrieving the post.');
    }
  }
}
