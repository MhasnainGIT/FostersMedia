import Gallery from '../models/Gallery.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { deleteFromCloudinary } from '../middleware/uploadMiddleware.js';

export const createGalleryItem = async (data) => {
  return await Gallery.create(data);
};

export const getGalleryItems = async (query = {}) => {
  const { page = 1, limit = 20, category, type, sortBy, sortOrder } = query;
  const filter = { isDeleted: { $ne: true } };

  if (category) filter.category = category;
  if (type) filter.type = type;

  const total = await Gallery.countDocuments(filter);
  const items = await Gallery.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: items,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getGalleryItemById = async (id) => {
  const item = await Gallery.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!item) throw new AppError('Gallery item not found', 404);
  return item;
};

export const updateGalleryItem = async (id, data) => {
  const item = await Gallery.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, data, {
    new: true,
  });
  if (!item) throw new AppError('Gallery item not found', 404);
  return item;
};

export const deleteGalleryItem = async (id) => {
  const item = await Gallery.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!item) throw new AppError('Gallery item not found', 404);

  await deleteFromCloudinary(item.publicId);

  await Gallery.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  return item;
};
