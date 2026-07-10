import mongoose from 'mongoose';

const influencerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    username: { type: String, required: [true, 'Username is required'], unique: true, trim: true },
    profileImage: { type: String, default: '' },
    profileImagePublicId: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    coverImagePublicId: { type: String, default: '' },
    bio: { type: String, default: '' },
    category: { type: String, required: [true, 'Category is required'] },
    city: { type: String, default: '' },
    languages: [{ type: String }],
    followers: {
      instagram: { type: Number, default: 0 },
      youtube: { type: Number, default: 0 },
      twitter: { type: Number, default: 0 },
      tiktok: { type: Number, default: 0 },
    },
    engagementRate: { type: Number, default: 0 },
    socialLinks: {
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available',
    },
    mediaKit: { type: String, default: '' },
    mediaKitPublicId: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

influencerSchema.index({ category: 1 });
influencerSchema.index({ city: 1 });

export default mongoose.model('Influencer', influencerSchema);
