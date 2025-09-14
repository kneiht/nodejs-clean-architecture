import { Router } from 'express';

import { loginController, registerController } from '../../container.js';

const authRoutes = Router();

authRoutes.post('/register', (req, res) => registerController.execute(req, res));
authRoutes.post('/login', (req, res) => loginController.execute(req, res));

export default authRoutes;
