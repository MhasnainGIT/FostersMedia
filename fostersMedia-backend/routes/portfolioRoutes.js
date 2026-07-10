import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createPortfolioSchema,
  updatePortfolioSchema,
  portfolioQuerySchema,
} from '../validators/portfolioValidator.js';
import {
  createPortfolioHandler,
  getPortfoliosHandler,
  getPortfolioByIdHandler,
  updatePortfolioHandler,
  deletePortfolioHandler,
} from '../controllers/portfolioController.js';

const router = express.Router();

router
  .route('/')
  .get(validate(portfolioQuerySchema, 'query'), getPortfoliosHandler)
  .post(
    protect,
    authorize('super_admin', 'admin'),
    validate(createPortfolioSchema),
    createPortfolioHandler
  );

router
  .route('/:id')
  .get(getPortfolioByIdHandler)
  .put(
    protect,
    authorize('super_admin', 'admin'),
    validate(updatePortfolioSchema),
    updatePortfolioHandler
  )
  .delete(protect, authorize('super_admin', 'admin'), deletePortfolioHandler);

export default router;
