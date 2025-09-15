import { Router } from 'express';
import { basicController } from '../controller.js';
import {
  addPostUseCase,
  deletePostUseCase,
  getAllPostsUseCase,
  getPostByIdUseCase,
  updatePostUseCase,
} from '@/container.js';

const postRoutes = Router();
postRoutes.get('/', basicController(getAllPostsUseCase));
postRoutes.post('/', basicController(addPostUseCase));
postRoutes.get('/:id', basicController(getPostByIdUseCase));
postRoutes.put('/:id', basicController(updatePostUseCase));
postRoutes.delete('/:id', basicController(deletePostUseCase));

export default postRoutes;
