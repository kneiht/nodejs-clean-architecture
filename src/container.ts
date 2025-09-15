import { UserInMemoryRepository } from '@/adapters/repositories/in-memory/user.repository.js';
import { PostInMemoryRepository } from '@/adapters/repositories/in-memory/post.repository.js';
import { PasswordHasher } from '@/adapters/utils/password.js';
import { JsonWebToken } from '@/adapters/utils/jwt.js';

// User use cases classes
import {
  AddUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  AddPostUseCase,
  GetAllPostsUseCase,
  GetPostByIdUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
} from '@/application/use-cases/index.js';

// Auth use cases classes
import { RegisterUseCase } from '@/application/use-cases/auth/register.use-case.js';
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case.js';
import { CheckAuthUseCase } from '@/application/use-cases/auth/check-auth.use-case.js';

// Environment variables
import { env } from '@/config/environment.js';

// Adapters
const passwordHasher = new PasswordHasher();
const userRepository = new UserInMemoryRepository();
const postRepository = new PostInMemoryRepository();
const jsonWebToken = new JsonWebToken(env.JWT_SECRET);

// Use Cases
const addUserUseCase = new AddUserUseCase(userRepository, passwordHasher);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// Post use cases
const addPostUseCase = new AddPostUseCase(postRepository);
const getAllPostsUseCase = new GetAllPostsUseCase(postRepository);
const getPostByIdUseCase = new GetPostByIdUseCase(postRepository);
const updatePostUseCase = new UpdatePostUseCase(postRepository);
const deletePostUseCase = new DeletePostUseCase(postRepository);

// Auth use cases
const registerUseCase = new RegisterUseCase(addUserUseCase, jsonWebToken);
const loginUseCase = new LoginUseCase(userRepository, passwordHasher, jsonWebToken);
const checkAuthUseCase = new CheckAuthUseCase(jsonWebToken, userRepository);

export {
  addUserUseCase,
  getAllUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  deleteUserUseCase,
  registerUseCase,
  loginUseCase,
  checkAuthUseCase,
  addPostUseCase,
  getAllPostsUseCase,
  getPostByIdUseCase,
  updatePostUseCase,
  deletePostUseCase,
};
