import { Router } from 'express';
import { basicController } from '../controller.js';
import {
  addUserUseCase,
  deleteUserUseCase,
  getAllUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
} from '@/container.js';

const userRoutes = Router();
userRoutes.get('/', basicController(getAllUsersUseCase));
userRoutes.post('/', basicController(addUserUseCase));
userRoutes.get('/:id', basicController(getUserByIdUseCase));
userRoutes.put('/:id', basicController(updateUserUseCase));
userRoutes.delete('/:id', basicController(deleteUserUseCase));

export default userRoutes;
