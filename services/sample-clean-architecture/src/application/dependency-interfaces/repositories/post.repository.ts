import { Post } from '@/entities/post.entity.js';

export interface IPostRepository {
  findById(id: string): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  add(post: Post): Promise<Post | null>;
  update(post: Post): Promise<Post>;
  delete(post: Post): Promise<void>;
}
