import Portfolio from '../models/Portfolio.js';
import Brand from '../models/Brand.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const createPortfolio = async (data, files = {}) => {
  if (data.client) {
    const brand = await Brand.findById(data.client);
    if (!brand) throw new AppError('Brand client not found', 404);
  }

  const portfolioData = { ...data };
  if (files.thumbnail) {
    portfolioData.thumbnail = files.thumbnail.url;
    portfolioData.thumbnailPublicId = files.thumbnail.publicId;
  }
  if (files.gallery) {
    portfolioData.gallery = files.gallery;
  }

  return await Portfolio.create(portfolioData);
};

export const getPortfolios = async (query = {}) => {
  const { page = 1, limit = 10, search, category, sortBy, sortOrder } = query;
  const filter = { isDeleted: { $ne: true } };

  if (search) {
    filter.$or = [{ title: { $regex: search, $options: 'i' } }];
  }

  if (category) filter.category = category;

  const total = await Portfolio.countDocuments(filter);
  const portfolios = await Portfolio.find(filter)
    .populate('client', 'companyName')
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: portfolios,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getPortfolioById = async (id) => {
  const portfolio = await Portfolio.findOne({ _id: id, isDeleted: { $ne: true } }).populate(
    'client',
    'companyName contactPerson'
  );
  if (!portfolio) throw new AppError('Portfolio not found', 404);
  return portfolio;
};

export const updatePortfolio = async (id, data) => {
  const portfolio = await Portfolio.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, data, {
    new: true,
  });
  if (!portfolio) throw new AppError('Portfolio not found', 404);
  return portfolio;
};

export const deletePortfolio = async (id) => {
  const portfolio = await Portfolio.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
  if (!portfolio) throw new AppError('Portfolio not found', 404);
  return portfolio;
};
