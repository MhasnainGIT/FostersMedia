import mongoose from 'mongoose';
import { EVENT_STATUS } from '../constants/index.js';

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Event name is required'], trim: true },
    description: { type: String, default: '' },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    videos: [
      {
        url: String,
        publicId: String,
      },
    ],
    venue: { type: String, default: '' },
    date: { type: Date, required: [true, 'Event date is required'] },
    brands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }],
    influencers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' }],
    status: { type: String, enum: Object.values(EVENT_STATUS), default: EVENT_STATUS.DRAFT },
    budget: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });

export default mongoose.model('Event', eventSchema);
