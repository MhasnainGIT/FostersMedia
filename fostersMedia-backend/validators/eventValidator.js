import { z } from 'zod';

export const createEventSchema = z.object({
  name: z.string().min(2, 'Event name must be at least 2 characters'),
  description: z.string().optional(),
  venue: z.string().optional(),
  date: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  budget: z.number().optional(),
  status: z.enum(['draft', 'planned', 'active', 'completed', 'cancelled']).optional(),
  brands: z.array(z.string()).optional(),
  influencers: z.array(z.string()).optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const eventQuerySchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('10'),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});
