import { apiClient } from "../lib/apiClient";
import { Testimonial } from "../types";

const mapTestimonialApiToFrontend = (raw: any): Testimonial => ({
  id: raw._id || raw.id || "",
  clientName: raw.clientName || "",
  company: raw.company || "",
  review: raw.review || "",
  rating: raw.rating ?? 0,
  profileImage: raw.profileImage || ""
});

export const testimonialService = {
  getTestimonials: async (): Promise<Testimonial[]> => {
    const testimonials = await apiClient.get<any[]>("/testimonials?limit=1000");
    return testimonials.map(mapTestimonialApiToFrontend);
  },

  getTestimonialById: async (id: string): Promise<Testimonial | null> => {
    try {
      const testimonial = await apiClient.get<any>(`/testimonials/${id}`);
      return mapTestimonialApiToFrontend(testimonial);
    } catch {
      return null;
    }
  },

  createTestimonial: async (data: Omit<Testimonial, "id">): Promise<Testimonial> => {
    const raw = await apiClient.post<any>("/testimonials", data);
    return mapTestimonialApiToFrontend(raw);
  },

  updateTestimonial: async (id: string, data: Partial<Testimonial>): Promise<Testimonial> => {
    const raw = await apiClient.put<any>(`/testimonials/${id}`, data);
    return mapTestimonialApiToFrontend(raw);
  },

  deleteTestimonial: async (id: string): Promise<void> => {
    await apiClient.delete(`/testimonials/${id}`);
  }
};
