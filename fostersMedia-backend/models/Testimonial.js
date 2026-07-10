import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: [true, 'Client name is required'], trim: true },
    company: { type: String, default: '' },
    review: { type: String, required: [true, 'Review is required'] },
    rating: { type: Number, min: 1, max: 5, required: [true, 'Rating is required'] },
    profileImage: { type: String, default: '' },
    profileImagePublicId: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

testimonialSchema.index({ rating: -1 });

export default mongoose.model('Testimonial', testimonialSchema);
