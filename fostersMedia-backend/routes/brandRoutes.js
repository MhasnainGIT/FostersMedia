import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createBrandSchema,
  updateBrandSchema,
  brandQuerySchema,
} from '../validators/brandValidator.js';
import {
  createBrandHandler,
  getBrandsHandler,
  getBrandByIdHandler,
  updateBrandHandler,
  deleteBrandHandler,
} from '../controllers/brandController.js';

const router = express.Router();

router
  .route('/')
  .get(validate(brandQuerySchema, 'query'), getBrandsHandler)
  .post(
    protect,
    authorize('super_admin', 'admin'),
    validate(createBrandSchema),
    createBrandHandler
  );

router
  .route('/:id')
  .get(getBrandByIdHandler)
  .put(protect, authorize('super_admin', 'admin'), validate(updateBrandSchema), updateBrandHandler)
  .delete(protect, authorize('super_admin', 'admin'), deleteBrandHandler);

export default router;
