import { successResponse, paginateResponse } from '../utils/response.js';
import {
  createTestimonial,
  getTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from '../services/testimonialService.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

export const createTestimonialHandler = async (req, res, next) => {
  try {
    const file = req.file
      ? await uploadToCloudinary(req.file.buffer, 'fosters-media/testimonials')
      : null;
    const testimonial = await createTestimonial(req.body, file);
    successResponse(res, 'Testimonial created successfully', testimonial, 201);
  } catch (error) {
    next(error);
  }
};

export const getTestimonialsHandler = async (req, res, next) => {
  try {
    const result = await getTestimonials(req.query);
    paginateResponse(res, 'Testimonials fetched successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getTestimonialByIdHandler = async (req, res, next) => {
  try {
    const testimonial = await getTestimonialById(req.params.id);
    successResponse(res, 'Testimonial fetched successfully', testimonial);
  } catch (error) {
    next(error);
  }
};

export const updateTestimonialHandler = async (req, res, next) => {
  try {
    const file = req.file
      ? await uploadToCloudinary(req.file.buffer, 'fosters-media/testimonials')
      : null;
    const testimonial = await updateTestimonial(req.params.id, req.body, file);
    successResponse(res, 'Testimonial updated successfully', testimonial);
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonialHandler = async (req, res, next) => {
  try {
    await deleteTestimonial(req.params.id);
    successResponse(res, 'Testimonial deleted successfully');
  } catch (error) {
    next(error);
  }
};
