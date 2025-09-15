import express from 'express';
import { logger } from './adapters/express/middlewares/logger.middleware.js';
import { errorHandler } from './adapters/express/middlewares/error-handler.middleware.js';
import { makeCheckAuthMiddleware } from './adapters/express/middlewares/auth.middleware.js';

import userRoutes from './adapters/express/routes/user.routes.js';
import authRoutes from './adapters/express/routes/auth.routes.js';
import postRoutes from './adapters/express/routes/post.routes.js';
import { checkAuthUseCase } from './container.js';

// Express
const app = express();

// Middlewares
app.use(logger);
app.use(express.json());
app.use(express.static('public'));
const checkUserAuth = makeCheckAuthMiddleware(checkAuthUseCase, 'user');
const checkAdminAuth = makeCheckAuthMiddleware(checkAuthUseCase, 'admin');

// Routes
app.use('/auth', authRoutes);
app.use('/users', checkAdminAuth, userRoutes);
app.use('/posts', checkUserAuth, postRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log('Test url: http://localhost:3000/test.html');
});
