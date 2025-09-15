import { Router } from 'express';
import { basicController } from '../controller.js';
import {
  addPostUseCase,
  deletePostUseCase,
  getAllPostsUseCase,
  getPostByIdUseCase,
  updatePostUseCase,
  checkAuthUseCase,
} from '@/container.js';
import { makeCheckAuthMiddleware } from '../middlewares/auth.middleware.js';

const postRoutes = Router();
const checkAuthMiddleware = makeCheckAuthMiddleware(checkAuthUseCase);

postRoutes.get('/', checkAuthMiddleware, basicController(getAllPostsUseCase));
postRoutes.post('/', checkAuthMiddleware, basicController(addPostUseCase));
postRoutes.get('/:id', checkAuthMiddleware, basicController(getPostByIdUseCase));
postRoutes.put('/:id', checkAuthMiddleware, basicController(updatePostUseCase));
postRoutes.delete('/:id', checkAuthMiddleware, basicController(deletePostUseCase));

export default postRoutes;
