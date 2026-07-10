import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import {
  createInfluencerSchema,
  updateInfluencerSchema,
  influencerQuerySchema,
} from '../validators/influencerValidator.js';
import {
  createInfluencerHandler,
  getInfluencersHandler,
  getInfluencerByIdHandler,
  updateInfluencerHandler,
  deleteInfluencerHandler,
  selfUpdateInfluencerHandler,
} from '../controllers/influencerController.js';
import { parseJsonFields } from '../middleware/validationMiddleware.js';

const JSON_FIELDS = ['languages', 'followers', 'socialLinks'];
const NUMBER_FIELDS = ['engagementRate'];
const BOOL_FIELDS = ['isVerified', 'isFeatured'];

const parseFormFields = (req, res, next) => {
  for (const f of NUMBER_FIELDS) {
    if (req.body[f] !== undefined) req.body[f] = Number(req.body[f]);
  }
  for (const f of BOOL_FIELDS) {
    if (req.body[f] !== undefined) req.body[f] = req.body[f] === 'true' || req.body[f] === true;
  }
  next();
};

const router = express.Router();

router
  .route('/')
  .get(validate(influencerQuerySchema, 'query'), getInfluencersHandler)
  .post(
    protect,
    authorize('super_admin', 'admin'),
    upload.fields([{ name: 'profileImage' }, { name: 'coverImage' }, { name: 'mediaKit' }]),
    parseJsonFields(JSON_FIELDS),
    parseFormFields,
    validate(createInfluencerSchema),
    createInfluencerHandler
  );

router
  .route('/:id')
  .get(getInfluencerByIdHandler)
  .put(
    protect,
    authorize('super_admin', 'admin'),
    upload.fields([{ name: 'profileImage' }, { name: 'coverImage' }, { name: 'mediaKit' }]),
    parseJsonFields(JSON_FIELDS),
    parseFormFields,
    updateInfluencerHandler
  )
  .delete(protect, authorize('super_admin', 'admin'), deleteInfluencerHandler);

// Self-update: only the influencer who owns this profile can update it
router.put('/:id/self', protect, upload.fields([{ name: 'profileImage' }]), selfUpdateInfluencerHandler);

export default router;
