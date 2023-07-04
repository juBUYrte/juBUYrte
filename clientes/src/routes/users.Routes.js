import express from 'express';
import UserController from '../controllers/UsersController.js';
import bearerMiddlaware from '../middlewares/ensureBearerMiddleware.js';

const router = express.Router();

const users = router
  .get('/api/admin/users/:id', bearerMiddlaware, UserController.getById)
  .get('/api/admin/users', bearerMiddlaware, UserController.getAll)
  .post('/api/admin/users', UserController.createUser)
  .delete('/api/admin/users/:id', bearerMiddlaware, UserController.deleteById);

export default users;
