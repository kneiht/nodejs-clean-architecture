import express from 'express';

import { logger } from './presentations/middlewares/logger.js';
import { errorHandler } from './presentations/middlewares/error-handler.js';
import userRoutes from './presentations/routes/user.routes.js';
import authRoutes from './presentations/routes/auth.routes.js';

// Express
const app = express();

// Middlewares
app.use(logger);
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error handler
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log('Test url: http://localhost:3000/test.html');
});
