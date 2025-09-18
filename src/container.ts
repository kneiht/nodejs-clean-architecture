// Import Repository Inplementations
import {
  UserInMemoryRepository,
  PostInMemoryRepository,
} from '@/adapters/repositories/in-memory/index.js';
import {
  UserMongoRepository,
  PostMongoRepository,
} from '@/adapters/repositories/mongodb/index.js';

// Import dependencies for use cases
import { PasswordHasher } from '@/adapters/utils/password.js';
import { JsonWebToken } from '@/adapters/utils/jwt.js';
import { env } from '@/config/environment.js';

// Import Generic Use Cases
import {
  AddUseCase,
  GetAllUseCase,
  GetByIdUseCase,
  UpdateUseCase,
  DeleteByIdUseCase,
} from '@/application/use-cases/index.js';

// Import Entities and Interfaces
import { UpdateUserInput } from '@/entities/user.entity.js';

import {
  CreatePostInput,
  Post,
  UpdatePostInput,
} from '@/entities/post.entity.js';

// Auth use cases classes
import { RegisterUseCase } from '@/application/use-cases/auth/register.use-case.js';
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case.js';
import { CheckAuthUseCase } from '@/application/use-cases/auth/check-auth.use-case.js';
import { AddUserUseCase } from './application/use-cases/user/add-user.use-case.js';

// Initialize dependencies
const passwordHasher = new PasswordHasher();
const jsonWebToken = new JsonWebToken(env.JWT_SECRET);

// Initialize repositories
const userRepository =
  env.DB_SELECT === 'MONGODB'
    ? new UserMongoRepository()
    : new UserInMemoryRepository();
const postRepository =
  env.DB_SELECT === 'MONGODB'
    ? new PostMongoRepository()
    : new PostInMemoryRepository();

// User use cases
const addUserUseCase = new AddUserUseCase(userRepository);
const getAllUsersUseCase = new GetAllUseCase(userRepository);
const getUserByIdUseCase = new GetByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUseCase<UpdateUserInput>(userRepository);
const deleteUserUseCase = new DeleteByIdUseCase(userRepository);

// Post use cases
const addPostUseCase = new AddUseCase<CreatePostInput>(Post, postRepository);
const getAllPostsUseCase = new GetAllUseCase(postRepository);
const getPostByIdUseCase = new GetByIdUseCase(postRepository);
const updatePostUseCase = new UpdateUseCase<UpdatePostInput>(postRepository);
const deletePostUseCase = new DeleteByIdUseCase(postRepository);

// Auth use cases
const registerUseCase = new RegisterUseCase(addUserUseCase, jsonWebToken);
const loginUseCase = new LoginUseCase(
  userRepository,
  passwordHasher,
  jsonWebToken,
);
const checkAuthUseCase = new CheckAuthUseCase(jsonWebToken, userRepository);

// Exports
export {
  // User
  addUserUseCase,
  getAllUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  deleteUserUseCase,
  // Post
  addPostUseCase,
  getAllPostsUseCase,
  getPostByIdUseCase,
  updatePostUseCase,
  deletePostUseCase,
  // Auth
  registerUseCase,
  loginUseCase,
  checkAuthUseCase,
};
