import { Post } from '@/entities/post.entity.js';
import { IPostRepository } from '@/application/dependency-interfaces/repositories/post.repository.js';
import { PostModel } from './schemas/post.schema.js';

export class PostMongoRepository implements IPostRepository {
  async findById(id: string): Promise<Post | null> {
    try {
      const postData = await PostModel.findById(id).exec();
      if (!postData) return null;

      return new Post({
        id: postData._id.toString(),
        title: postData.title,
        content: postData.content,
        userId: postData.userId.toString(),
        createdAt: postData.createdAt,
        updatedAt: postData.updatedAt,
      });
    } catch (error) {
      throw new Error(
        `Failed to find post by ID: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findAll(): Promise<Post[]> {
    try {
      const postsData = await PostModel.find().exec();
      return postsData.map(
        (postData) =>
          new Post({
            id: postData._id.toString(),
            title: postData.title,
            content: postData.content,
            userId: postData.userId.toString(),
            createdAt: postData.createdAt,
            updatedAt: postData.updatedAt,
          }),
      );
    } catch (error) {
      throw new Error(
        `Failed to find all posts: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async add(post: Post): Promise<Post> {
    try {
      const postData = new PostModel({
        _id: post.id,
        title: post.title,
        content: post.content,
        userId: post.userId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      });

      await postData.save();
      return post;
    } catch (error) {
      throw new Error(
        `Failed to add post: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async update(post: Post): Promise<Post> {
    try {
      const updatedPost = await PostModel.findByIdAndUpdate(
        post.id,
        {
          title: post.title,
          content: post.content,
          userId: post.userId.toString(),
          updatedAt: post.updatedAt,
          createdAt: post.createdAt,
        },
        { new: true, runValidators: true, upsert: true },
      ).exec();

      if (!updatedPost) {
        throw new Error('Post not found');
      }
      return post;
    } catch (error) {
      throw new Error(
        `Failed to update user: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async delete(post: Post): Promise<void> {
    try {
      const result = await PostModel.findByIdAndDelete(post.id).exec();
      if (!result) {
        throw new Error('Post not found');
      }
    } catch (error) {
      throw new Error(
        `Failed to delete post: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
