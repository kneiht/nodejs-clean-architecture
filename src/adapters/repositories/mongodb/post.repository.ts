import { Post } from '@/entities/post.entity.js';
import { IPostRepository } from '@/application/dependency-interfaces/repositories/post.repository.js';
import { PostModel } from './schemas/post.schema.js';
import { MongoRepository } from './base.repository.js';

export class PostMongoRepository extends MongoRepository<Post> implements IPostRepository {
  constructor() {
    super(PostModel);
  }

  // Override add and update to ensure data consistency if needed, otherwise the base implementation is often sufficient.
  // For Post, the base implementation is likely fine, but showing override for clarity.
  async add(post: Post): Promise<Post> {
    const postData = {
      _id: post.id,
      ...post,
    };
    await PostModel.create(postData);
    return post;
  }

  async update(post: Post): Promise<Post> {
    await PostModel.findByIdAndUpdate(post.id, post).exec();
    return post;
  }
}
