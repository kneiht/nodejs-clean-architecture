import { UserInMemoryRepository } from '@/adapters/repositories/user.repository.js';
import { PasswordHasher } from '@/adapters/utils/password.js';

// User use cases
import {
  AddUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '@/application/use-cases/index.js';

// User controllers
import {
  AddUserController,
  GetAllUsersController,
  GetUserByIdController,
  UpdateUserController,
  DeleteUserController,
} from '@/adapters/controllers/index.js';

// Auth use cases
import { RegisterUseCase } from '@/application/use-cases/auth/register.use-case.js';
import { LoginUseCase } from '@/application/use-cases/auth/login.use-case.js';

// Auth controllers
import { RegisterController } from '@/adapters/controllers/auth/register.controller.js';
import { LoginController } from '@/adapters/controllers/auth/login.controller.js';
import { JsonWebToken } from '@/adapters/utils/jwt.js';

// Adapters
const passwordHasher = new PasswordHasher();
const userRepository = new UserInMemoryRepository();
const jsonWebToken = new JsonWebToken('your-secret-key'); // TODO: use environment variable

// Use Cases
const addUserUseCase = new AddUserUseCase(userRepository, passwordHasher);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// Auth use cases
const registerUseCase = new RegisterUseCase(addUserUseCase, jsonWebToken);
const loginUseCase = new LoginUseCase(userRepository, passwordHasher, jsonWebToken);

// User controllers
const addUserController = new AddUserController(addUserUseCase);
const getAllUsersController = new GetAllUsersController(getAllUsersUseCase);
const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
const updateUserController = new UpdateUserController(updateUserUseCase);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

// Auth controllers
const registerController = new RegisterController(registerUseCase);
const loginController = new LoginController(loginUseCase);

// Export user controllers instances
export {
  addUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
};

// Export auth controllers instances
export { registerController, loginController };
