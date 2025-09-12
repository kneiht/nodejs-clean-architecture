import express from 'express';
import { UserCreationController } from '@/adapters/controllers/user/user-creation.controller.js';
import { AddUserUseCase } from '@/application/use-cases/user/add.use-case.js';
import { UserInMemoryRepository } from '@/adapters/repositories/user.repository.js';
import { PasswordHasher } from '@/adapters/utils/password.js';

// Express
const app = express();
app.use(express.json());

// Dependencies
const passwordHasher = new PasswordHasher();
const userRepository = new UserInMemoryRepository();

// Use Case
const addUserUseCase = new AddUserUseCase(userRepository, passwordHasher);

// Controller
const userCreationController = new UserCreationController(addUserUseCase);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', userCreationController.execute);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
