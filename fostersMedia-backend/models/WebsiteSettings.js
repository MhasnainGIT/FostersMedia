import mongoose from 'mongoose';

const websiteSettingsSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: '' },
    heroSubtitle: { type: String, default: '' },
    contactInfo: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    logo: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    footer: { type: String, default: '' },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('WebsiteSettings', websiteSettingsSchema);
