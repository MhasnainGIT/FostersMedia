import { apiClient } from "../lib/apiClient";
import { Brand } from "../types";

const mapBrand = (raw: any): Brand => ({
  id: raw._id || raw.id || "",
  companyName: raw.companyName || "",
  contactPerson: raw.contactPerson || "",
  email: raw.email || "",
  phone: raw.phone || "",
  industry: raw.industry || "",
  website: raw.website || "",
  address: raw.address || "",
  notes: raw.notes || "",
});

export const brandService = {
  getBrands: async (): Promise<Brand[]> => {
    const brands = await apiClient.get<any[]>("/brands?limit=1000");
    return brands.map(mapBrand);
  },

  createBrand: async (data: Omit<Brand, "id">): Promise<Brand> => {
    const raw = await apiClient.post<any>("/brands", data);
    return mapBrand(raw);
  },

  updateBrand: async (id: string, data: Partial<Brand>): Promise<Brand> => {
    const raw = await apiClient.put<any>(`/brands/${id}`, data);
    return mapBrand(raw);
  },

  deleteBrand: async (id: string): Promise<void> => {
    await apiClient.delete(`/brands/${id}`);
  },
};
