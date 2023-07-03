import express from 'express';
import AccountController from '../controllers/AccountsController.js';
import bearerMiddleware from '../middlewares/ensureBearerMiddleware.js';

const router = express.Router();

router
  .post('/api/accounts/login', AccountController.loginAccount)
  .get('/api/admin/accounts', bearerMiddleware, AccountController.findAccounts)
  .get('/api/admin/accounts/:id', bearerMiddleware, AccountController.findAccountById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .put('/api/admin/accounts/:id', bearerMiddleware, AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', bearerMiddleware, AccountController.deleteAccount);

export default router;
