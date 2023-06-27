import express from 'express';
import AccountController from '../controllers/AccountsController.js';
import bearerMiddlaware from '../middlewares/ensureBearerMiddleware.js';

const router = express.Router();

router
  .post('/api/accounts/login', AccountController.loginAccount)
  .get('/api/admin/accounts', bearerMiddlaware, AccountController.findAccounts)
  .get('/api/admin/accounts/:id', AccountController.findAccountById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .put('/api/admin/accounts/:id', AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', AccountController.deleteAccount);

export default router;
