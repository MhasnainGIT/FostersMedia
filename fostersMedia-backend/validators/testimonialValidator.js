import { z } from 'zod';

export const createTestimonialSchema = z.object({
  clientName: z.string().min(2, 'Client name must be at least 2 characters'),
  company: z.string().optional(),
  review: z.string().min(10, 'Review must be at least 10 characters'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export const testimonialQuerySchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('10'),
  sortBy: z.string().optional().default('rating'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
