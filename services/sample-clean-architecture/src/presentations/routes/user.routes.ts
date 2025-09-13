import { Router } from 'express';

import {
  addUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from '../../container.js';

const userRoutes = Router();

// Get all users
userRoutes.get('/', (req, res) => getAllUsersController.execute(req, res));

// Get by id
userRoutes.get('/:id', (req, res) => getUserByIdController.execute(req, res));

// Create
userRoutes.post('/', (req, res) => addUserController.execute(req, res));

// Update
userRoutes.patch('/:id', (req, res) => updateUserController.execute(req, res));

// Delete
userRoutes.delete('/:id', (req, res) => deleteUserController.execute(req, res));

export default userRoutes;