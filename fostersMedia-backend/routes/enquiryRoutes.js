import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createEnquirySchema,
  updateEnquirySchema,
  enquiryQuerySchema,
} from '../validators/enquiryValidator.js';
import {
  createEnquiryHandler,
  getEnquiriesHandler,
  getEnquiryByIdHandler,
  updateEnquiryHandler,
  deleteEnquiryHandler,
} from '../controllers/enquiryController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, validate(enquiryQuerySchema, 'query'), getEnquiriesHandler)
  .post(validate(createEnquirySchema), createEnquiryHandler);

router
  .route('/:id')
  .get(protect, getEnquiryByIdHandler)
  .put(
    protect,
    authorize('super_admin', 'admin'),
    validate(updateEnquirySchema),
    updateEnquiryHandler
  )
  .delete(protect, authorize('super_admin', 'admin'), deleteEnquiryHandler);

export default router;
