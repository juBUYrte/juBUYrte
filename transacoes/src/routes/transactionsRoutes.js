import express from 'express';
import TransactionsController from '../controllers/TransactionsController.js';

const router = express.Router();

router
  .post('/api/admin/transactions', TransactionsController.createTransaction)

export default router;
