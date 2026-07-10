import { successResponse, paginateResponse } from '../utils/response.js';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} from '../services/enquiryService.js';

export const createEnquiryHandler = async (req, res, next) => {
  try {
    const enquiry = await createEnquiry(req.body);
    successResponse(res, 'Enquiry created successfully', enquiry, 201);
  } catch (error) {
    next(error);
  }
};

export const getEnquiriesHandler = async (req, res, next) => {
  try {
    const result = await getEnquiries(req.query);
    paginateResponse(res, 'Enquiries fetched successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getEnquiryByIdHandler = async (req, res, next) => {
  try {
    const enquiry = await getEnquiryById(req.params.id);
    successResponse(res, 'Enquiry fetched successfully', enquiry);
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryHandler = async (req, res, next) => {
  try {
    const enquiry = await updateEnquiry(req.params.id, req.body);
    successResponse(res, 'Enquiry updated successfully', enquiry);
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiryHandler = async (req, res, next) => {
  try {
    await deleteEnquiry(req.params.id);
    successResponse(res, 'Enquiry deleted successfully');
  } catch (error) {
    next(error);
  }
};
