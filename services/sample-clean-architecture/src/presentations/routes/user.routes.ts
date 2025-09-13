import { Router } from 'express';
import { userCreationController } from '../../container.js';

const userRoutes = Router();

// Get all users
userRoutes.get('/', (req, res) => {
  res.send('Get all users');
});

// Get by id
userRoutes.get('/:id', (req, res) => {
  res.send('Get user by id');
});

// Create
userRoutes.post('/', (req, res) => userCreationController.execute(req, res));

// Update
userRoutes.patch('/:id', (req, res) => {
  res.send('Update user');
});

// Delete
userRoutes.delete('/:id', (req, res) => {
  res.send('Delete user');
});

export default userRoutes;
