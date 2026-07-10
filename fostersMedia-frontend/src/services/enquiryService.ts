import { apiClient } from "../lib/apiClient";
import { Enquiry } from "../types";

const mapEnquiryApiToFrontend = (raw: any): Enquiry => ({
  id: raw._id || raw.id || "",
  brandDetails: raw.brandDetails || {},
  campaignType: raw.campaignType || "",
  budget: raw.budget || "",
  eventDate: raw.eventDate ? new Date(raw.eventDate).toISOString().split("T")[0] : "",
  location: raw.location || "",
  influencerCategory: raw.influencerCategory || "",
  message: raw.message || "",
  status: raw.status || "Pending",
  assignedStaff: raw.assignedStaff || null,
  followUpNotes: raw.followUpNotes || "",
  createdDate: raw.createdAt ? new Date(raw.createdAt).toISOString().split("T")[0] : ""
});

export const enquiryService = {
  getEnquiries: async (): Promise<Enquiry[]> => {
    const enquiries = await apiClient.get<any[]>("/enquiries?limit=1000");
    return enquiries.map(mapEnquiryApiToFrontend);
  },

  createEnquiry: async (data: Omit<Enquiry, "id" | "status" | "createdDate" | "assignedStaff">): Promise<Enquiry> => {
    const raw = await apiClient.post<any>("/enquiries", data);
    return mapEnquiryApiToFrontend(raw);
  },

  updateEnquiryStatus: async (id: string, status: Enquiry["status"]): Promise<Enquiry> => {
    const raw = await apiClient.put<any>(`/enquiries/${id}`, { status });
    return mapEnquiryApiToFrontend(raw);
  },

  updateEnquiry: async (id: string, data: Partial<Enquiry>): Promise<Enquiry> => {
    const raw = await apiClient.put<any>(`/enquiries/${id}`, data);
    return mapEnquiryApiToFrontend(raw);
  },

  deleteEnquiry: async (id: string): Promise<void> => {
    await apiClient.delete(`/enquiries/${id}`);
  }
};
