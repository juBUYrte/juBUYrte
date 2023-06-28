import express from 'express';
import UserController from '../controllers/UsersController.js';

const router = express.Router();

const users = router
  .get('/api/admin/users/:id', UserController.getById)
  .get('/api/admin/users', UserController.getAll)
  .post('/api/admin/users', UserController.createUser)
  .delete('/api/admin/users/:id', UserController.deleteById);

export default users;
