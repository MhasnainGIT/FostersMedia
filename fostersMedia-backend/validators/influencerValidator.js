import { z } from 'zod';

export const createInfluencerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(2, 'Username must be at least 2 characters'),
  bio: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  city: z.string().optional(),
  languages: z.array(z.string()).optional(),
  followers: z
    .object({
      instagram: z.number().optional(),
      youtube: z.number().optional(),
      twitter: z.number().optional(),
      tiktok: z.number().optional(),
    })
    .optional(),
  engagementRate: z.number().min(0).max(100).optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      youtube: z.string().optional(),
      twitter: z.string().optional(),
      tiktok: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
  availability: z.enum(['available', 'busy', 'unavailable']).optional(),
  isFeatured: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  status: z.string().optional(),
});

export const updateInfluencerSchema = createInfluencerSchema.partial();

export const influencerQuerySchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('10'),
  search: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  isFeatured: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  isVerified: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
