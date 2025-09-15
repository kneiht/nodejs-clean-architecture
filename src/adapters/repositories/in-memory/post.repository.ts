import { Post } from '@/entities/post.entity.js';
import { IPostRepository } from '@/application/dependency-interfaces/repositories/post.repository.js';
import { uuidv7 } from 'uuidv7';

export class PostInMemoryRepository implements IPostRepository {
  private posts: Post[] = [
    new Post({
      title: 'Post 1',
      content: 'Content 1',
      userId: uuidv7().toString(),
    }),
    new Post({
      title: 'Post 2',
      content: 'Content 2',
      userId: uuidv7().toString(),
    }),
    new Post({
      title: 'Post 3',
      content: 'Content 3',
      userId: uuidv7().toString(),
    }),
  ];

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
