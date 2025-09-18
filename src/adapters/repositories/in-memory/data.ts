import { Post } from '@/entities/post.entity.js';
import { User } from '@/entities/user.entity.js';

export const users = [
  User.hydrate({
    id: '1',
    email: 'admin@example.com',
    name: 'User admin',
    passwordHash:
      '$2a$10$mAbRyqfrNcp6TgApLBbiQuq8PSBAwyH2ZAXRVIPfULfo6KETzerk6',
    role: 'admin',
    createdAt: new Date('2025-09-17T10:00:00.000Z'),
    updatedAt: new Date('2025-09-17T10:00:00.000Z'),
  }),
  User.hydrate({
    id: '2',
    email: 'admin1@example.com',
    name: 'Admin One',
    passwordHash: 'hashedpassword2',
    role: 'admin',
    createdAt: new Date('2025-09-17T11:00:00.000Z'),
    updatedAt: new Date('2025-09-17T11:00:00.000Z'),
  }),
];

export const posts = [
  Post.hydrate({
    id: '1',
    title: 'Post 1',
    content: 'Content of post 1',
    userId: '1',
    createdAt: new Date('2025-09-17T10:00:00.000Z'),
    updatedAt: new Date('2025-09-17T10:00:00.000Z'),
  }),
  Post.hydrate({
    id: '2',
    title: 'Post 2',
    content: 'Content of post 2',
    userId: '1',
    createdAt: new Date('2025-09-17T11:00:00.000Z'),
    updatedAt: new Date('2025-09-17T11:00:00.000Z'),
  }),
  Post.hydrate({
    id: '3',
    title: 'Post 3',
    content: 'Content of post 3',
    userId: '2',
    createdAt: new Date('2025-09-17T12:00:00.000Z'),
    updatedAt: new Date('2025-09-17T12:00:00.000Z'),
  }),
];
