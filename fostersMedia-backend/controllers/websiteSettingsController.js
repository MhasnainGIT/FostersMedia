import { successResponse } from '../utils/response.js';
import { getSettings, updateSettings } from '../services/websiteSettingsService.js';

export const getSettingsHandler = async (req, res, next) => {
  try {
    const settings = await getSettings();
    successResponse(res, 'Website settings fetched successfully', settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettingsHandler = async (req, res, next) => {
  try {
    const settings = await updateSettings(req.body);
    successResponse(res, 'Website settings updated successfully', settings);
  } catch (error) {
    next(error);
  }
};
