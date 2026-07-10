import { successResponse, paginateResponse } from '../utils/response.js';
import {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from '../services/portfolioService.js';

export const createPortfolioHandler = async (req, res, next) => {
  try {
    const portfolio = await createPortfolio(req.body);
    successResponse(res, 'Portfolio created successfully', portfolio, 201);
  } catch (error) {
    next(error);
  }
};

export const getPortfoliosHandler = async (req, res, next) => {
  try {
    const result = await getPortfolios(req.query);
    paginateResponse(res, 'Portfolios fetched successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getPortfolioByIdHandler = async (req, res, next) => {
  try {
    const portfolio = await getPortfolioById(req.params.id);
    successResponse(res, 'Portfolio fetched successfully', portfolio);
  } catch (error) {
    next(error);
  }
};

export const updatePortfolioHandler = async (req, res, next) => {
  try {
    const portfolio = await updatePortfolio(req.params.id, req.body);
    successResponse(res, 'Portfolio updated successfully', portfolio);
  } catch (error) {
    next(error);
  }
};

export const deletePortfolioHandler = async (req, res, next) => {
  try {
    await deletePortfolio(req.params.id);
    successResponse(res, 'Portfolio deleted successfully');
  } catch (error) {
    next(error);
  }
};
