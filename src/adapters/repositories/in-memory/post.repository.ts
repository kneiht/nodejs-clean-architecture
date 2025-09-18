import { Post } from '@/entities/post.entity.js';
import { IPostRepository } from '@/application/dependency-interfaces/repositories/post.repository.js';
import { InMemoryRepository } from './base.repository.js';
import { posts } from './data.js';

export class PostInMemoryRepository
  extends InMemoryRepository<Post>
  implements IPostRepository
{
  constructor() {
    // Pass initial data to the base class
    super(posts);
  }
  // CRUD are from the base class
}
