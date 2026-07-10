import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: [true, 'Company name is required'], trim: true },
    contactPerson: { type: String, required: [true, 'Contact person is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true },
    phone: { type: String, default: '' },
    industry: { type: String, default: '' },
    website: { type: String, default: '' },
    address: { type: String, default: '' },
    notes: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

brandSchema.index({ companyName: 'text', contactPerson: 'text' });

export default mongoose.model('Brand', brandSchema);
