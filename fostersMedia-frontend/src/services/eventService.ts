import { apiClient } from "../lib/apiClient";
import { Event } from "../types";

export const eventService = {
  getEvents: async (): Promise<Event[]> => {
    return apiClient.get<Event[]>("/events");
  },

  getEventById: async (id: number): Promise<Event | null> => {
    try {
      return await apiClient.get<Event>(`/events/${id}`);
    } catch {
      return null;
    }
  },

  createEvent: async (data: Omit<Event, "id">): Promise<Event> => {
    return apiClient.post<Event>("/events", data);
  },

  updateEvent: async (id: number, data: Partial<Event>): Promise<Event> => {
    return apiClient.put<Event>(`/events/${id}`, data);
  },

  deleteEvent: async (id: number): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  }
};
