import express from 'express';
import AccountController from '../controllers/AccountsController.js';
import authTokenMiddleware from '../middlewares/authTokenMiddleware.js';

const router = express.Router();

router
  .get('/api/admin/accounts', authTokenMiddleware, AccountController.findAccounts)
  .get('/api/admin/accounts/:id', authTokenMiddleware, AccountController.findAccountById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .post('/api/accounts/login', AccountController.login)
  .put('/api/admin/accounts/:id', authTokenMiddleware, AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', authTokenMiddleware, AccountController.deleteAccount);

export default router;
