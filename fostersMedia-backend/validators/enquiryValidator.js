import { z } from 'zod';

export const createEnquirySchema = z.object({
  brandDetails: z
    .object({
      companyName: z.string().optional(),
      contactPerson: z.string().optional(),
      email: z.string().email('Invalid email').optional(),
      phone: z.string().optional(),
    })
    .optional(),
  campaignType: z.string().optional(),
  budget: z.string().optional(),
  eventDate: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  location: z.string().optional(),
  influencerCategory: z.string().optional(),
  message: z.string().optional(),
});

export const updateEnquirySchema = z.object({
  status: z.enum(['pending', 'contacted', 'negotiating', 'won', 'lost']).optional(),
  assignedStaff: z.string().optional(),
  followUpNotes: z.string().optional(),
});

export const enquiryQuerySchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('10'),
  status: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
