import { Router } from 'express';
import { basicController } from '../controller.js';
import { loginUseCase, registerUseCase } from '@/container.js';

const authRoutes = Router();

authRoutes.post('/register', basicController(registerUseCase));
authRoutes.post('/login', basicController(loginUseCase));

export default authRoutes;
