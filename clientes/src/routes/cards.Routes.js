import express from 'express';
import CardController from '../controllers/CardsController.js';
import bearerMiddlaware from '../middlewares/ensureBearerMiddleware.js';

const router = express.Router();

const cards = router
  .get('/api/admin/users/cards/:id', bearerMiddlaware, CardController.getRentById)
  .post('/api/admin/users/cards', bearerMiddlaware, CardController.validateCard);

export default cards;
