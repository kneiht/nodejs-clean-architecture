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
  UserCreationController,
  UserListingController,
  UserDetailsController,
  UserUpdatingController,
  UserDeletionController,
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
const userCreationController = new UserCreationController(addUserUseCase);
const userListingController = new UserListingController(getAllUsersUseCase);
const userDetailsController = new UserDetailsController(getUserByIdUseCase);
const userUpdatingController = new UserUpdatingController(updateUserUseCase);
const userDeletionController = new UserDeletionController(deleteUserUseCase);

// Export controllers instances
export {
  userCreationController,
  userListingController,
  userDetailsController,
  userUpdatingController,
  userDeletionController,
};
