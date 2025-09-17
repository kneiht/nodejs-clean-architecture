import { IUseCase } from '@/application/use-cases/index.js';
import { IPostRepository } from '@/application/dependency-interfaces/repositories/post.repository.js';
import { Post } from '@/entities/post.entity.js';
import { failureInternal, successOk, UseCaseReponse } from '@/application/use-cases/response.js';

export class GetAllPostsUseCase implements IUseCase<void, Post[]> {
  // Inject dependencies
  constructor(private postRepository: IPostRepository) {}

  // Execute the use case
  async execute(): Promise<UseCaseReponse<Post[]>> {
    // Catch any errors
    try {
      // Find all posts
      const posts = await this.postRepository.findAll();

      // Return the posts
      return successOk(posts);
    } catch (error) {
      // Handle other errors
      console.log(error);
      return failureInternal('An unexpected error occurred while retrieving posts.');
    }
  }
}
