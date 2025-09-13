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

// Adapters
const passwordHasher = new PasswordHasher();
const userRepository = new UserInMemoryRepository();

// Use Cases
const addUserUseCase = new AddUserUseCase(userRepository, passwordHasher);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// Controllers
const addUserController = new AddUserController(addUserUseCase);
const getAllUsersController = new GetAllUsersController(getAllUsersUseCase);
const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
const updateUserController = new UpdateUserController(updateUserUseCase);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

// Export controllers instances
export {
  addUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
};