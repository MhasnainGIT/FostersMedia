import Influencer from '../models/Influencer.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const createInfluencer = async (data, files = {}) => {
  const influencerData = { ...data };
  if (files.profileImage) {
    influencerData.profileImage = files.profileImage.url;
    influencerData.profileImagePublicId = files.profileImage.publicId;
  }
  if (files.coverImage) {
    influencerData.coverImage = files.coverImage.url;
    influencerData.coverImagePublicId = files.coverImage.publicId;
  }
  if (files.mediaKit) {
    influencerData.mediaKit = files.mediaKit.url;
    influencerData.mediaKitPublicId = files.mediaKit.publicId;
  }
  return await Influencer.create(influencerData);
};

export const getInfluencers = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    city,
    isFeatured,
    isVerified,
    sortBy,
    sortOrder,
  } = query;
  const filter = { isDeleted: { $ne: true } };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) filter.category = category;
  if (city) filter.city = city;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured;
  if (isVerified !== undefined) filter.isVerified = isVerified;

  const total = await Influencer.countDocuments(filter);
  const influencers = await Influencer.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: influencers,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getInfluencerById = async (id) => {
  const influencer = await Influencer.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!influencer) throw new AppError('Influencer not found', 404);
  return influencer;
};

export const updateInfluencer = async (id, data, files = {}) => {
  const updateData = { ...data };
  if (files.profileImage) {
    updateData.profileImage = files.profileImage.url;
    updateData.profileImagePublicId = files.profileImage.publicId;
  }
  if (files.coverImage) {
    updateData.coverImage = files.coverImage.url;
    updateData.coverImagePublicId = files.coverImage.publicId;
  }
  if (files.mediaKit) {
    updateData.mediaKit = files.mediaKit.url;
    updateData.mediaKitPublicId = files.mediaKit.publicId;
  }

  const influencer = await Influencer.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    updateData,
    { new: true }
  );
  if (!influencer) throw new AppError('Influencer not found', 404);
  return influencer;
};

export const deleteInfluencer = async (id) => {
  const influencer = await Influencer.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
  if (!influencer) throw new AppError('Influencer not found', 404);
  return influencer;
};
