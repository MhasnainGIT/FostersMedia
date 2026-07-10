import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createGallerySchema,
  updateGallerySchema,
  galleryQuerySchema,
} from '../validators/galleryValidator.js';
import {
  createGalleryHandler,
  getGalleryHandler,
  getGalleryItemHandler,
  updateGalleryHandler,
  deleteGalleryHandler,
} from '../controllers/galleryController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(validate(galleryQuerySchema, 'query'), getGalleryHandler)
  .post(
    protect,
    authorize('super_admin', 'admin'),
    upload.single('media'),
    validate(createGallerySchema),
    createGalleryHandler
  );

router
  .route('/:id')
  .get(getGalleryItemHandler)
  .put(
    protect,
    authorize('super_admin', 'admin'),
    validate(updateGallerySchema),
    updateGalleryHandler
  )
  .delete(protect, authorize('super_admin', 'admin'), deleteGalleryHandler);

export default router;
