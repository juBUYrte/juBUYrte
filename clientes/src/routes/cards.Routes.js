import express from 'express';
import CardController from '../controllers/CardsController.js';

const router = express.Router();

const cards = router
  .get('/api/admin/users/cards/:id', CardController.getRentById)
  .post('/api/admin/users/cards', CardController.validateCard);

export default cards;
