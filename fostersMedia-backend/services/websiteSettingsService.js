import WebsiteSettings from '../models/WebsiteSettings.js';

export const getSettings = async () => {
  let settings = await WebsiteSettings.findOne();
  if (!settings) {
    settings = await WebsiteSettings.create({});
  }
  return settings;
};

export const updateSettings = async (data) => {
  const settings = await WebsiteSettings.findOne();
  if (settings) {
    return await WebsiteSettings.findOneAndUpdate({}, data, { new: true, runValidators: true });
  }
  return await WebsiteSettings.create(data);
};
