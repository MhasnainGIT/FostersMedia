import Testimonial from '../models/Testimonial.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { deleteFromCloudinary } from '../middleware/uploadMiddleware.js';

export const createTestimonial = async (data, file = null) => {
  const testimonialData = { ...data };
  if (file) {
    testimonialData.profileImage = file.url;
    testimonialData.profileImagePublicId = file.publicId;
  }
  return await Testimonial.create(testimonialData);
};

export const getTestimonials = async (query = {}) => {
  const { page = 1, limit = 10, sortBy, sortOrder } = query;
  const filter = { isDeleted: { $ne: true } };

  const total = await Testimonial.countDocuments(filter);
  const testimonials = await Testimonial.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: testimonials,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getTestimonialById = async (id) => {
  const testimonial = await Testimonial.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  return testimonial;
};

export const updateTestimonial = async (id, data, file = null) => {
  const updateData = { ...data };
  if (file) {
    updateData.profileImage = file.url;
    updateData.profileImagePublicId = file.publicId;
  }

  const testimonial = await Testimonial.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    updateData,
    { new: true }
  );
  if (!testimonial) throw new AppError('Testimonial not found', 404);
  return testimonial;
};

export const deleteTestimonial = async (id) => {
  const testimonial = await Testimonial.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!testimonial) throw new AppError('Testimonial not found', 404);

  if (testimonial.profileImagePublicId)
    await deleteFromCloudinary(testimonial.profileImagePublicId);

  await Testimonial.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  return testimonial;
};
