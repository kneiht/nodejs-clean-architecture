import { Post } from '@/entities/post.entity.js';
import { IPostRepository } from '@/application/dependency-interfaces/repositories/post.repository.js';

export class PostInMemoryRepository implements IPostRepository {
  private posts: Post[] = [];

  async findById(id: string): Promise<Post | null> {
    return this.posts.find((post) => post.id === id) || null;
  }

  async findAll(): Promise<Post[]> {
    return this.posts;
  }

  async add(post: Post): Promise<Post> {
    this.posts.push(post);
    return post;
  }

  async update(post: Post): Promise<Post> {
    const index = this.posts.findIndex((p) => p.id === post.id);
    if (index === -1) {
      throw new Error('Post not found');
    }
    this.posts[index] = post;
    return post;
  }

  async delete(post: Post): Promise<void> {
    const index = this.posts.findIndex((p) => p.id === post.id);
    if (index === -1) {
      throw new Error('Post not found');
    }
    this.posts.splice(index, 1);
  }
}
