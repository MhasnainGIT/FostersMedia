import Event from '../models/Event.js';
import Influencer from '../models/Influencer.js';
import Brand from '../models/Brand.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const createEvent = async (data) => {
  const eventData = { ...data };

  if (data.influencers && data.influencers.length > 0) {
    const validInfluencers = await Influencer.find({ _id: { $in: data.influencers } });
    if (validInfluencers.length !== data.influencers.length) {
      throw new AppError('One or more influencers not found', 404);
    }
  }

  if (data.brands && data.brands.length > 0) {
    const validBrands = await Brand.find({ _id: { $in: data.brands } });
    if (validBrands.length !== data.brands.length) {
      throw new AppError('One or more brands not found', 404);
    }
  }

  return await Event.create(eventData);
};

export const getEvents = async (query = {}) => {
  const { page = 1, limit = 10, search, status, sortBy, sortOrder } = query;
  const filter = { isDeleted: { $ne: true } };

  if (search) {
    filter.$or = [{ name: { $regex: search, $options: 'i' } }];
  }

  if (status) filter.status = status;

  const total = await Event.countDocuments(filter);
  const events = await Event.find(filter)
    .populate('brands', 'companyName contactPerson')
    .populate('influencers', 'name username category')
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: events,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getEventById = async (id) => {
  const event = await Event.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate('brands', 'companyName contactPerson email phone')
    .populate('influencers', 'name username category');
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

export const updateEvent = async (id, data) => {
  const event = await Event.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, data, {
    new: true,
  });
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

export const deleteEvent = async (id) => {
  const event = await Event.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
  if (!event) throw new AppError('Event not found', 404);
  return event;
};
