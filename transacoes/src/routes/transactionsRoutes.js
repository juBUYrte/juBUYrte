import express from 'express';
import TransactionsController from '../controllers/TransactionsController.js';
import bearerMiddleware from '../middlewares/ensureBearerMiddleware.js';

const router = express.Router();

router
  .post('/api/admin/transactions', bearerMiddleware, TransactionsController.createTransaction)
  .get('/api/admin/transactions/:id', bearerMiddleware, TransactionsController.getTransactionById)
  .patch('/api/admin/transactions/:id', bearerMiddleware, TransactionsController.updateStatusById)
  .get('/api/admin/transactions/', bearerMiddleware, TransactionsController.getAllTransactions)

export default router;
