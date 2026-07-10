import { z } from 'zod';

export const createGallerySchema = z.object({
  title: z.string().optional(),
  type: z.enum(['image', 'video'], { required_error: 'Type is required' }),
  category: z.string().optional(),
});

export const updateGallerySchema = createGallerySchema.partial();

export const galleryQuerySchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('20'),
  category: z.string().optional(),
  type: z.enum(['image', 'video']).optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
