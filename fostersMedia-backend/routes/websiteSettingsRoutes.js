import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { websiteSettingsSchema } from '../validators/websiteSettingsValidator.js';
import {
  getSettingsHandler,
  updateSettingsHandler,
} from '../controllers/websiteSettingsController.js';

const router = express.Router();

router
  .route('/')
  .get(getSettingsHandler)
  .put(
    protect,
    authorize('super_admin', 'admin'),
    validate(websiteSettingsSchema),
    updateSettingsHandler
  );

export default router;
