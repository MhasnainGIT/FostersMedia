import Enquiry from '../models/Enquiry.js';
import Admin from '../models/Admin.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const createEnquiry = async (data) => {
  return await Enquiry.create(data);
};

export const getEnquiries = async (query = {}) => {
  const { page = 1, limit = 10, status, search, sortBy, sortOrder } = query;
  const filter = { isDeleted: { $ne: true } };

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { 'brandDetails.companyName': { $regex: search, $options: 'i' } },
      { 'brandDetails.contactPerson': { $regex: search, $options: 'i' } },
      { campaignType: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Enquiry.countDocuments(filter);
  const enquiries = await Enquiry.find(filter)
    .populate('assignedStaff', 'name email')
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: enquiries,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getEnquiryById = async (id) => {
  const enquiry = await Enquiry.findOne({ _id: id, isDeleted: { $ne: true } }).populate(
    'assignedStaff',
    'name email'
  );
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  return enquiry;
};

export const updateEnquiry = async (id, data) => {
  const updateData = { ...data };

  if (data.assignedStaff) {
    const admin = await Admin.findById(data.assignedStaff);
    if (!admin) throw new AppError('Assigned staff not found', 404);
  }

  const enquiry = await Enquiry.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    updateData,
    { new: true }
  );
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  return enquiry;
};

export const deleteEnquiry = async (id) => {
  const enquiry = await Enquiry.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  return enquiry;
};

export const updateEnquiryStatus = async (id, status) => {
  const enquiry = await Enquiry.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { status },
    { new: true }
  );
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  return enquiry;
};
