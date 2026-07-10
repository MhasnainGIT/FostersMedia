import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['super_admin', 'admin', 'manager']).optional(),
});

export const userRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits').optional(),
  accountType: z.enum(['user', 'influencer', 'brand']).default('user'),
  instagramHandle: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  platforms: z.array(z.string()).optional(),
});
