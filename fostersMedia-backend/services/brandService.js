import Brand from '../models/Brand.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const createBrand = async (data) => {
  return await Brand.create(data);
};

export const getBrands = async (query = {}) => {
  const { page = 1, limit = 10, search, industry, sortBy, sortOrder } = query;
  const filter = { isDeleted: { $ne: true } };

  if (search) {
    filter.$or = [
      { companyName: { $regex: search, $options: 'i' } },
      { contactPerson: { $regex: search, $options: 'i' } },
    ];
  }

  if (industry) filter.industry = industry;

  const total = await Brand.countDocuments(filter);
  const brands = await Brand.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: brands,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getBrandById = async (id) => {
  const brand = await Brand.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!brand) throw new AppError('Brand not found', 404);
  return brand;
};

export const updateBrand = async (id, data) => {
  const brand = await Brand.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, data, {
    new: true,
  });
  if (!brand) throw new AppError('Brand not found', 404);
  return brand;
};

export const deleteBrand = async (id) => {
  const brand = await Brand.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
  if (!brand) throw new AppError('Brand not found', 404);
  return brand;
};
