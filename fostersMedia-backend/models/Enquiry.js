import mongoose from 'mongoose';
import { ENQUIRY_STATUS } from '../constants/index.js';

const enquirySchema = new mongoose.Schema(
  {
    brandDetails: {
      companyName: { type: String, default: '' },
      contactPerson: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    campaignType: { type: String, default: '' },
    budget: { type: String, default: '' },
    eventDate: { type: Date },
    location: { type: String, default: '' },
    influencerCategory: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, enum: Object.values(ENQUIRY_STATUS), default: ENQUIRY_STATUS.PENDING },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    followUpNotes: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

enquirySchema.index({ status: 1 });

export default mongoose.model('Enquiry', enquirySchema);
