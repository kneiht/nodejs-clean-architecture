import {
  UserInMemoryRepository,
  PostInMemoryRepository,
} from '@/adapters/repositories/in-memory/index.js';
import {
  UserMongoRepository,
  PostMongoRepository,
} from '@/adapters/repositories/mongodb/index.js';
import { PasswordHasher } from '@/adapters/utils/password.js';
import { JsonWebToken } from '@/adapters/utils/jwt.js';
import { env } from '@/config/environment.js';

// Import Generic Use Cases
import { AddUseCase } from '@/application/use-cases/base/add.use-case.js';
import { DeleteUseCase } from '@/application/use-cases/base/delete.use-case.js';
import { GetAllUseCase } from '@/application/use-cases/base/get-all.use-case.js';
import { GetByIdUseCase } from '@/application/use-cases/base/get-by-id.use-case.js';
import { UpdateUseCase } from '@/application/use-cases/base/update.use-case.js';

// Import Entities and Interfaces
import {
  CreateUserInput,
  createUserInputSchema,
  HydrateUserInput,
  hydrateUserInputSchema,
  User,
} from '@/entities/user.entity.js';
import {
  CreatePostInput,
  createPostInputSchema,
  HydratePostInput,
  hydratePostInputSchema,
  Post,
} from '@/entities/post.entity.js';

// Auth use cases classes (these are not generic)
import { RegisterUseCase } from '@/application/use-cases/auth/register.use-case.js';
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case.js';
import { CheckAuthUseCase } from '@/application/use-cases/auth/check-auth.use-case.js';
import { uuidv7 } from 'uuidv7';

// Adapters
const passwordHasher = new PasswordHasher();
const jsonWebToken = new JsonWebToken(env.JWT_SECRET);

// Repositories
const userRepository =
  env.DB_SELECT === 'MONGODB'
    ? new UserMongoRepository()
    : new UserInMemoryRepository();
const postRepository =
  env.DB_SELECT === 'MONGODB'
    ? new PostMongoRepository()
    : new PostInMemoryRepository();

// User use case dependencies
const createUser = async (userCreateInput: CreateUserInput): Promise<User> =>
  await User.create(userCreateInput, uuidv7, passwordHasher.hash);
const hydrateUser = (userHydrateInput: HydrateUserInput): User =>
  User.hydrate(userHydrateInput);

// User use cases
const addUserUseCase = new AddUseCase<User, CreateUserInput>(
  userRepository,
  createUserInputSchema,
  createUser,
  'User',
);
const getAllUsersUseCase = new GetAllUseCase<User>(userRepository, 'User');
const getUserByIdUseCase = new GetByIdUseCase<User>(userRepository, 'User');
const updateUserUseCase = new UpdateUseCase<User, HydrateUserInput>(
  userRepository,
  hydrateUserInputSchema,
  hydrateUser,
  'User',
);
const deleteUserUseCase = new DeleteUseCase<User>(userRepository, 'User');

// Post use case dependencies
const createPost = async (postCreateInput: CreatePostInput): Promise<Post> =>
  await Post.create(postCreateInput, uuidv7);
const hydratePost = (postHydrateInput: HydratePostInput): Post =>
  Post.hydrate(postHydrateInput);

// Post use cases
const addPostUseCase = new AddUseCase<Post, CreatePostInput>(
  postRepository,
  createPostInputSchema,
  createPost,
  'Post',
);
const getAllPostsUseCase = new GetAllUseCase<Post>(postRepository, 'Post');
const getPostByIdUseCase = new GetByIdUseCase<Post>(postRepository, 'Post');
const updatePostUseCase = new UpdateUseCase<Post, HydratePostInput>(
  postRepository,
  hydratePostInputSchema,
  hydratePost,
  'Post',
);
const deletePostUseCase = new DeleteUseCase<Post>(postRepository, 'Post');

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
