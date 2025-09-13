
import { UserCreationController } from '@/adapters/controllers/index.js';
import { UserInMemoryRepository } from '@/adapters/repositories/user.repository.js';
import { PasswordHasher } from '@/adapters/utils/password.js';
import { AddUserUseCase } from '@/application/use-cases/user/add-user.use-case.js';

// Adapters
const passwordHasher = new PasswordHasher();
const userRepository = new UserInMemoryRepository();

// Use Cases
const addUserUseCase = new AddUserUseCase(userRepository, passwordHasher);

// Controllers
const userCreationController = new UserCreationController(addUserUseCase);

// Export controllers and other dependencies if needed elsewhere
export { userCreationController };
