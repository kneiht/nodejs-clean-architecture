import { Post } from '@/entities/post.entity.js';
import { IBaseRepository } from './base.repository.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IPostRepository extends IBaseRepository<Post> {}
