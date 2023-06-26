import express from 'express';
import AccountController from '../controllers/AccountsController.js';
import ensureTokenMiddleware from '../middlewares/ensureTokenMiddleware.js';

const router = express.Router();

router
  .post('/api/accounts/login', AccountController.loginAccount)
  .get('/api/admin/accounts', ensureTokenMiddleware, AccountController.findAccounts)
  .get('/api/admin/accounts/:id', AccountController.findAccountById)
  .post('/api/admin/accounts', AccountController.createAccount)
  .put('/api/admin/accounts/:id', AccountController.updateAccount)
  .delete('/api/admin/accounts/:id', AccountController.deleteAccount);

export default router;
