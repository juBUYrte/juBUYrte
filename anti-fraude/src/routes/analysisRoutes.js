import express from 'express';
import AnalysisController from '../controllers/AnalysisController.js';
import authTokenMiddleware from '../middlewares/authTokenMiddleware.js';

const router = express.Router();

router
  .post('/api/admin/analysis', authTokenMiddleware, AnalysisController.createAnalysis);

export default router;
