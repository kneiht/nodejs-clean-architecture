import { Post } from '@/entities/post.entity.js';
import { IPostRepository } from '@/application/dependency-interfaces/repositories/post.repository.js';
import { uuidv7 } from 'uuidv7';
import { InMemoryRepository } from './base.repository.js';

// Seed initial data
const initialPosts = [
  Post.create(
    {
      title: 'Post 1',
      content: 'Content 1',
      userId: uuidv7(),
    },
    uuidv7,
  ),
  Post.create(
    {
      title: 'Post 2',
      content: 'Content 2',
      userId: uuidv7(),
    },
    uuidv7,
  ),
];

export class PostInMemoryRepository extends InMemoryRepository<Post> implements IPostRepository {
  constructor() {
    // Pass initial data to the base class
    super(initialPosts);
  }
  // CRUD are from the base class
}
