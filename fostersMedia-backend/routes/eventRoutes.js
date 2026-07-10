import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createEventSchema,
  updateEventSchema,
  eventQuerySchema,
} from '../validators/eventValidator.js';
import {
  createEventHandler,
  getEventsHandler,
  getEventByIdHandler,
  updateEventHandler,
  deleteEventHandler,
} from '../controllers/eventController.js';

const router = express.Router();

router
  .route('/')
  .get(validate(eventQuerySchema, 'query'), getEventsHandler)
  .post(
    protect,
    authorize('super_admin', 'admin'),
    validate(createEventSchema),
    createEventHandler
  );

router
  .route('/:id')
  .get(getEventByIdHandler)
  .put(protect, authorize('super_admin', 'admin'), validate(updateEventSchema), updateEventHandler)
  .delete(protect, authorize('super_admin', 'admin'), deleteEventHandler);

export default router;
