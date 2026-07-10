import User from '../models/User.js';
import Influencer from '../models/Influencer.js';
import { generateTokens } from '../middleware/authMiddleware.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  user.password = undefined;
  user.refreshToken = undefined;

  return { user, accessToken, refreshToken };
};

const normalizeUsername = (name) => {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug || 'creator'}-${Date.now().toString().slice(-6)}`;
};

export const register = async (data) => {
  const {
    instagramHandle,
    category,
    location,
    bio,
    website,
    platforms,
    accountType,
    ...rest
  } = data;

  const userPayload = {
    ...rest,
    accountType,
    profile: {
      instagramHandle: instagramHandle || '',
      category: category || '',
      location: location || '',
      bio: bio || '',
      website: website || '',
      platforms: Array.isArray(platforms) ? platforms : []
    }
  };

  const user = await User.create(userPayload);

  if (accountType === 'influencer') {
    await Influencer.create({
      name: user.name,
      username: normalizeUsername(user.name),
      category: category || 'Lifestyle',
      city: location || '',
      bio: bio || '',
      profileImage: '',
      coverImage: '',
      followers: {
        instagram: 0,
        youtube: 0,
        twitter: 0,
        tiktok: 0
      },
      socialLinks: {
        instagram: instagramHandle || '',
        website: website || ''
      },
      availability: 'available',
      isVerified: false,
      isFeatured: false
    });
  }

  user.password = undefined;
  return user;
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const getMe = async (userId) => {
  return await User.findById(userId);
};

export const refreshToken = async (userId) => {
  const user = await User.findById(userId).select('+refreshToken');
  if (!user) throw new AppError('User not found', 404);

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
  user.refreshToken = newRefreshToken;
  await user.save();

  user.refreshToken = undefined;
  return { user, accessToken, refreshToken: newRefreshToken };
};
