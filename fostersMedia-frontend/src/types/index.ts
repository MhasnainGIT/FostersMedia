export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "staff" | "user";
  accountType?: "user" | "influencer" | "brand";
  profile?: {
    instagramHandle?: string;
    category?: string;
    location?: string;
    bio?: string;
    website?: string;
    platforms?: string[];
  };
  avatar?: string;
}

export interface Influencer {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
  coverImage?: string;
  bio: string;
  category: string;
  city: string;
  location?: string;
  languages: string[];
  phone?: string;
  email?: string;
  followers: {
    instagram?: number;
    youtube?: number;
    twitter?: number;
    tiktok?: number;
  };
  engagementRate?: number;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    tiktok?: string;
    website?: string;
  };
  availability: "available" | "busy" | "unavailable";
  status?: "active" | "inactive";
  mediaKit?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
}

export interface Enquiry {
  id: string;
  brandDetails: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  campaignType: string;
  budget: string;
  eventDate?: string;
  location?: string;
  influencerCategory?: string;
  message: string;
  status: "Pending" | "Contacted" | "Negotiating" | "Won" | "Lost";
  assignedStaff?: { name: string; email: string } | null;
  followUpNotes?: string;
  createdDate: string;
}

export interface Campaign {
  id: number;
  name: string;
  brand: string;
  influencers: number;
  status: "Active" | "Planning" | "Completed";
  progress: number;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  brands: string[];
  influencers: number;
  image: string;
  status: "Registration Open" | "VIP Access Only" | "Planning Phase" | "Completed";
  attendees?: number;
  gallery?: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  thumbnail?: string;
  description: string;
  category: string;
  client?: { companyName: string } | null;
  completionDate?: string;
  results?: string;
}

export interface Brand {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  industry?: string;
  website?: string;
  address?: string;
  notes?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  review: string;
  rating: number;
  profileImage?: string;
}

export interface WebsiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  logoText: string;
  email: string;
  phone: string;
  instagramUrl: string;
  facebookUrl: string;
  footerText: string;
}
