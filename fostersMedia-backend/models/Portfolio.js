import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Project title is required'], trim: true },
    thumbnail: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    gallery: [
      {
        url: String,
        publicId: String,
      },
    ],
    description: { type: String, default: '' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    category: { type: String, default: '' },
    completionDate: { type: Date },
    results: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

portfolioSchema.index({ title: 'text' });

export default mongoose.model('Portfolio', portfolioSchema);
