import express from 'express';
import TransactionsController from '../controllers/TransactionsController.js';

const router = express.Router();

router
  .post('/api/admin/transactions', TransactionsController.createTransaction)
  .get('/api/admin/transactions/:id', TransactionsController.getTransactionById)
  .patch('/api/admin/transactions/:id', TransactionsController.updateStatusById)
  .get('/api/admin/transactions/', TransactionsController.getAllTransactions)
  .delete('/api/admin/transactions/:id', TransactionsController.deleteById)

export default router;
