import { successResponse, paginateResponse } from '../utils/response.js';
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from '../services/brandService.js';

export const createBrandHandler = async (req, res, next) => {
  try {
    const brand = await createBrand(req.body);
    successResponse(res, 'Brand created successfully', brand, 201);
  } catch (error) {
    next(error);
  }
};

export const getBrandsHandler = async (req, res, next) => {
  try {
    const result = await getBrands(req.query);
    paginateResponse(res, 'Brands fetched successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getBrandByIdHandler = async (req, res, next) => {
  try {
    const brand = await getBrandById(req.params.id);
    successResponse(res, 'Brand fetched successfully', brand);
  } catch (error) {
    next(error);
  }
};

export const updateBrandHandler = async (req, res, next) => {
  try {
    const brand = await updateBrand(req.params.id, req.body);
    successResponse(res, 'Brand updated successfully', brand);
  } catch (error) {
    next(error);
  }
};

export const deleteBrandHandler = async (req, res, next) => {
  try {
    await deleteBrand(req.params.id);
    successResponse(res, 'Brand deleted successfully');
  } catch (error) {
    next(error);
  }
};
