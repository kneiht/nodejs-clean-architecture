import { Router } from 'express';

import {
  userCreationController,
  userListingController,
  userDetailsController,
  userUpdatingController,
  userDeletionController,
} from '../../container.js';

const userRoutes = Router();

// Get all users
userRoutes.get('/', (req, res) => userListingController.execute(req, res));

// Get by id
userRoutes.get('/:id', (req, res) => userDetailsController.execute(req, res));

// Create
userRoutes.post('/', (req, res) => userCreationController.execute(req, res));

// Update
userRoutes.patch('/:id', (req, res) => userUpdatingController.execute(req, res));

// Delete
userRoutes.delete('/:id', (req, res) => userDeletionController.execute(req, res));

export default userRoutes;
