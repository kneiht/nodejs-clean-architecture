import { Router } from 'express';
import { basicController } from '../controller.js';
import {
  addUserUseCase,
  checkAuthUseCase,
  deleteUserUseCase,
  getAllUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
} from '@/container.js';
import { makeCheckAuthMiddleware } from '../middlewares/auth.middleware.js';

const userRoutes = Router();
const checkAuthMiddleware = makeCheckAuthMiddleware(checkAuthUseCase);

userRoutes.get('/', checkAuthMiddleware, basicController(getAllUsersUseCase));
userRoutes.post('/', basicController(addUserUseCase));
userRoutes.get('/:id', basicController(getUserByIdUseCase));
userRoutes.put('/:id', basicController(updateUserUseCase));
userRoutes.delete('/:id', basicController(deleteUserUseCase));

export default userRoutes;
