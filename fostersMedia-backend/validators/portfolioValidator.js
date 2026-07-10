import { z } from 'zod';

export const createPortfolioSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().optional(),
  client: z.string().optional(),
  completionDate: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  results: z.string().optional(),
});

export const updatePortfolioSchema = createPortfolioSchema.partial();

export const portfolioQuerySchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('10'),
  search: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.string().optional().default('completionDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
