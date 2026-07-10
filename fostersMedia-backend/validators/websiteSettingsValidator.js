import { z } from 'zod';

export const websiteSettingsSchema = z.object({
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  contactInfo: z
    .object({
      email: z.string().email('Invalid email').optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      youtube: z.string().optional(),
    })
    .optional(),
  footer: z.string().optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.string().optional(),
    })
    .optional(),
});
