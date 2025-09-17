import z from 'zod';
import { IUseCase } from '@/application/use-cases/index.js';
import { IPostRepository } from '@/application/dependency-interfaces/repositories/post.repository.js';
import {
  failureInternal,
  failureNotFound,
  failureValidation,
  successNoContent,
  UseCaseReponse,
} from '@/application/use-cases/response.js';

// Define input schema
const deletePostInputSchema = z.object({
  id: z.string().min(1, { message: 'Post ID cannot be empty' }),
});

// Define input
export type DeletePostUseCaseInput = z.infer<typeof deletePostInputSchema>;

// Define the use case
export class DeletePostUseCase implements IUseCase<DeletePostUseCaseInput, void> {
  // Inject dependencies
  constructor(private postRepository: IPostRepository) {}

  // Execute the use case
  async execute(input: DeletePostUseCaseInput): Promise<UseCaseReponse<void>> {
    // Catch any errors
    try {
      // Validate input
      const result = deletePostInputSchema.safeParse(input);
      if (!result.success) {
        return failureValidation(result.error.issues.map((iss) => iss.message).join(', '));
      }
      const { id } = result.data;

      // Find the post to delete
      const post = await this.postRepository.findById(id);
      if (!post) {
        return failureNotFound(`Post with id ${id} not found`);
      }

      // Delete the post
      await this.postRepository.delete(post);

      // Return success with no content
      return successNoContent();
    } catch (error) {
      // Handle other errors
      console.log(error);
      return failureInternal('An unexpected error occurred while deleting the post.');
    }
  }
}
