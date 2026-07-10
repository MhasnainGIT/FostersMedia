import Influencer from '../models/Influencer.js';
import Event from '../models/Event.js';
import Brand from '../models/Brand.js';
import Portfolio from '../models/Portfolio.js';
import Enquiry from '../models/Enquiry.js';
import { ENQUIRY_STATUS } from '../constants/index.js';

export const getDashboardStats = async () => {
  const [
    totalInfluencers,
    activeCampaigns,
    upcomingEvents,
    totalBrands,
    pendingEnquiries,
    notifications,
  ] = await Promise.all([
    Influencer.countDocuments({ isDeleted: { $ne: true } }),
    Portfolio.countDocuments({ isDeleted: { $ne: true } }),
    Event.countDocuments({ isDeleted: { $ne: true }, date: { $gte: new Date() } }),
    Brand.countDocuments({ isDeleted: { $ne: true } }),
    Enquiry.countDocuments({ isDeleted: { $ne: true }, status: ENQUIRY_STATUS.PENDING }),
    getNotifications(),
  ]);

  return {
    totalInfluencers,
    activeCampaigns,
    upcomingEvents,
    totalBrands,
    pendingEnquiries,
    notifications,
  };
};

export const getMonthlyGrowth = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const growth = await Enquiry.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, isDeleted: { $ne: true } } },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return growth.map((g) => ({ month: g._id, count: g.count }));
};

export const getRecentActivities = async () => {
  const recentInfluencers = await Influencer.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name username createdAt');

  const recentEvents = await Event.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name date createdAt');

  return {
    influencers: recentInfluencers,
    events: recentEvents,
  };
};

export const getNotifications = async () => {
  const pendingEnquiries = await Enquiry.find({
    status: ENQUIRY_STATUS.PENDING,
    isDeleted: { $ne: true },
  })
    .sort({ createdAt: -1 })
    .limit(5);

  return pendingEnquiries.map((e) => ({
    id: e._id,
    type: 'enquiry',
    message: `New enquiry from ${e.brandDetails?.companyName || 'Unknown'}`,
    createdAt: e.createdAt,
  }));
};
