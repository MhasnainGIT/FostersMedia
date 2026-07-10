import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  testimonialQuerySchema,
} from '../validators/testimonialValidator.js';
import {
  createTestimonialHandler,
  getTestimonialsHandler,
  getTestimonialByIdHandler,
  updateTestimonialHandler,
  deleteTestimonialHandler,
} from '../controllers/testimonialController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(validate(testimonialQuerySchema, 'query'), getTestimonialsHandler)
  .post(
    protect,
    authorize('super_admin', 'admin'),
    upload.single('profileImage'),
    validate(createTestimonialSchema),
    createTestimonialHandler
  );

router
  .route('/:id')
  .get(getTestimonialByIdHandler)
  .put(
    protect,
    authorize('super_admin', 'admin'),
    upload.single('profileImage'),
    validate(updateTestimonialSchema),
    updateTestimonialHandler
  )
  .delete(protect, authorize('super_admin', 'admin'), deleteTestimonialHandler);

export default router;
