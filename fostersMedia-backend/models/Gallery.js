import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    url: { type: String, required: [true, 'Media URL is required'] },
    publicId: { type: String, required: [true, 'Public ID is required'] },
    type: { type: String, enum: ['image', 'video'], required: [true, 'Type is required'] },
    category: { type: String, default: 'general' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1 });

export default mongoose.model('Gallery', gallerySchema);
