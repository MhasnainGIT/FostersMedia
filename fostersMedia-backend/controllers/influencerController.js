import { successResponse, paginateResponse } from '../utils/response.js';
import {
  createInfluencer,
  getInfluencers,
  getInfluencerById,
  updateInfluencer,
  deleteInfluencer,
} from '../services/influencerService.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/uploadMiddleware.js';

export const createInfluencerHandler = async (req, res, next) => {
  try {
    const files = {};
    if (req.files?.profileImage) {
      const result = await uploadToCloudinary(
        req.files.profileImage[0].buffer,
        'fosters-media/influencers'
      );
      files.profileImage = { url: result.secure_url, publicId: result.public_id };
    }
    if (req.files?.coverImage) {
      const result = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
        'fosters-media/influencers'
      );
      files.coverImage = { url: result.secure_url, publicId: result.public_id };
    }
    if (req.files?.mediaKit) {
      const result = await uploadToCloudinary(
        req.files.mediaKit[0].buffer,
        'fosters-media/media-kits',
        'raw'
      );
      files.mediaKit = { url: result.secure_url, publicId: result.public_id };
    }

    const influencer = await createInfluencer(req.body, files);
    successResponse(res, 'Influencer created successfully', influencer, 201);
  } catch (error) {
    next(error);
  }
};

export const getInfluencersHandler = async (req, res, next) => {
  try {
    const result = await getInfluencers(req.query);
    paginateResponse(res, 'Influencers fetched successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getInfluencerByIdHandler = async (req, res, next) => {
  try {
    const influencer = await getInfluencerById(req.params.id);
    successResponse(res, 'Influencer fetched successfully', influencer);
  } catch (error) {
    next(error);
  }
};

export const updateInfluencerHandler = async (req, res, next) => {
  try {
    const files = {};
    const hasCloudinary = process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your-api-key';

    if (hasCloudinary && req.files?.profileImage?.[0]) {
      const result = await uploadToCloudinary(req.files.profileImage[0].buffer, 'fosters-media/influencers');
      files.profileImage = { url: result.secure_url, publicId: result.public_id };
    }
    if (hasCloudinary && req.files?.coverImage?.[0]) {
      const result = await uploadToCloudinary(req.files.coverImage[0].buffer, 'fosters-media/influencers');
      files.coverImage = { url: result.secure_url, publicId: result.public_id };
    }
    if (hasCloudinary && req.files?.mediaKit?.[0]) {
      const result = await uploadToCloudinary(req.files.mediaKit[0].buffer, 'fosters-media/media-kits', 'raw');
      files.mediaKit = { url: result.secure_url, publicId: result.public_id };
    }

    const influencer = await updateInfluencer(req.params.id, req.body, files);
    successResponse(res, 'Influencer updated successfully', influencer);
  } catch (error) {
    next(error);
  }
};

export const deleteInfluencerHandler = async (req, res, next) => {
  try {
    const influencer = await deleteInfluencer(req.params.id);
    if (influencer.profileImagePublicId)
      await deleteFromCloudinary(influencer.profileImagePublicId);
    if (influencer.coverImagePublicId) await deleteFromCloudinary(influencer.coverImagePublicId);
    if (influencer.mediaKitPublicId) await deleteFromCloudinary(influencer.mediaKitPublicId);
    successResponse(res, 'Influencer deleted successfully', influencer);
  } catch (error) {
    next(error);
  }
};

// Only the influencer who owns this profile (matched by email) can update it
export const selfUpdateInfluencerHandler = async (req, res, next) => {
  try {
    const influencer = await getInfluencerById(req.params.id);

    const user = req.user;
    const isOwner =
      (user.email && influencer.email && user.email === influencer.email) ||
      (user.accountType === 'influencer' && user.name === influencer.name);

    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'You can only update your own profile.' });
    }

    const allowed = ['name', 'bio', 'category', 'city', 'country', 'languages', 'socialLinks', 'availability', 'status', 'engagementRate', 'followers', 'profileImage', 'coverImage', 'phone'];
    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    // Handle profile image file upload
    if (req.files?.profileImage) {
      const result = await uploadToCloudinary(
        req.files.profileImage[0].buffer,
        'fosters-media/influencers'
      );
      updateData.profileImage = result.secure_url;
      updateData.profileImagePublicId = result.public_id;
    }

    const updated = await updateInfluencer(req.params.id, updateData);
    successResponse(res, 'Profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};
