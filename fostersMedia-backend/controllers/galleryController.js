import { successResponse, paginateResponse } from '../utils/response.js';
import {
  createGalleryItem,
  getGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
} from '../services/galleryService.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

export const createGalleryHandler = async (req, res, next) => {
  try {
    const files = req.files?.media;
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'Media file is required' });
    }

    const result = await uploadToCloudinary(
      files[0].buffer,
      'fosters-media/gallery',
      req.body.type
    );

    const item = await createGalleryItem({
      title: req.body.title,
      url: result.secure_url,
      publicId: result.public_id,
      type: req.body.type,
      category: req.body.category,
    });

    successResponse(res, 'Gallery item created successfully', item, 201);
  } catch (error) {
    next(error);
  }
};

export const getGalleryHandler = async (req, res, next) => {
  try {
    const result = await getGalleryItems(req.query);
    paginateResponse(res, 'Gallery items fetched successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getGalleryItemHandler = async (req, res, next) => {
  try {
    const item = await getGalleryItemById(req.params.id);
    successResponse(res, 'Gallery item fetched successfully', item);
  } catch (error) {
    next(error);
  }
};

export const updateGalleryHandler = async (req, res, next) => {
  try {
    const item = await updateGalleryItem(req.params.id, req.body);
    successResponse(res, 'Gallery item updated successfully', item);
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryHandler = async (req, res, next) => {
  try {
    await deleteGalleryItem(req.params.id);
    successResponse(res, 'Gallery item deleted successfully');
  } catch (error) {
    next(error);
  }
};
