import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useDashboardStore } from "../../store/dashboardStore";

export interface Influencer {
  id: number;
  name: string;
  category: string;
  image: string;
  followers: string;
  engagement: string;
  location: string;
  languages: string[];
  platforms: string[];
  city: string;
  phone: string;
  email: string;
  availability: "Available" | "Busy" | "Unavailable";
  status: "Active" | "Inactive";
  bio?: string;
  reachInstagram?: string;
  reachYoutube?: string;
  reachTwitter?: string;
  avgLikes?: string;
  gallery?: string[];
  collaborations?: { name: string; campaign: string }[];
}

export interface Enquiry {
  id: number;
  company: string;
  contact: string;
  email: string;
  phone: string;
  budget: string;
  campaignType: string;
  status: "Pending" | "Contacted" | "Negotiating" | "Won" | "Lost";
  assignedTo: string;
  createdDate: string;
  message: string;
}

export interface Campaign {
  id: number;
  name: string;
  brand: string;
  influencers: number;
  status: "Active" | "Planning" | "Completed";
  progress: number;
}

interface LiveStats {
  visitors: number;
  revenue: number;
  campaignsCount: number;
  activeCollaborations: string[];
}

interface DataContextType {
  influencers: Influencer[];
  enquiries: Enquiry[];
  campaigns: Campaign[];
  liveStats: LiveStats;
  addInfluencer: (inf: Omit<Influencer, "id">) => void;
  updateInfluencer: (id: number, inf: Partial<Influencer>) => void;
  deleteInfluencer: (id: number) => void;
  addEnquiry: (enq: Omit<Enquiry, "id" | "status" | "createdDate" | "assignedTo">) => void;
  updateEnquiryStatus: (id: number, status: Enquiry["status"]) => void;
  deleteEnquiry: (id: number) => void;
  addCampaign: (camp: Omit<Campaign, "id">) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialInfluencers: Influencer[] = [];
const initialEnquiries: Enquiry[] = [];
const initialCampaigns: Campaign[] = [];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [influencers, setInfluencers] = useState<Influencer[]>(() => {
    const saved = localStorage.getItem("fm_influencers");
    return saved ? JSON.parse(saved) : initialInfluencers;
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem("fm_enquiries");
    return saved ? JSON.parse(saved) : initialEnquiries;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem("fm_campaigns");
    return saved ? JSON.parse(saved) : initialCampaigns;
  });

  const [liveStats, setLiveStats] = useState<LiveStats>({
    visitors: 0,
    revenue: 0,
    campaignsCount: 0,
    activeCollaborations: []
  });

  const setWebsocketConnected = useDashboardStore((s) => s.setWebsocketConnected);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    localStorage.setItem("fm_influencers", JSON.stringify(influencers));
  }, [influencers]);

  useEffect(() => {
    localStorage.setItem("fm_enquiries", JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem("fm_campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  // Live Statistics & WebSocket
  useEffect(() => {
    const url = (import.meta as any).env?.VITE_WS_URL;
    if (!url) {
      console.debug("DataContext: no WebSocket URL configured, skipping live socket connect.");
      return;
    }
    let reconnectTimer: number | null = null;

    const connect = () => {
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.addEventListener("open", () => { setWebsocketConnected(true); });

        ws.addEventListener("message", (event) => {
          try {
            const data = JSON.parse(event.data);
            const { type, payload } = data as { type: string; payload: any };
            if (type === "liveStats") setLiveStats((prev) => ({ ...prev, ...payload }));
            else if (type === "enquiry") setEnquiries((prev) => [payload, ...prev]);
            else if (type === "influencer") setInfluencers((prev) => [payload, ...prev]);
            else if (type === "campaign") setCampaigns((prev) => [payload, ...prev]);
          } catch (e) { /* ignore */ }
        });

        ws.addEventListener("close", (ev) => {
          setWebsocketConnected(false);
          reconnectTimer = window.setTimeout(() => connect(), 3000);
        });

        ws.addEventListener("error", () => {
          setWebsocketConnected(false);
          try { ws.close(); } catch { /* ignore */ }
        });
      } catch (e) { setWebsocketConnected(false); }
    };

    connect();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (wsRef.current) { try { wsRef.current.close(); } catch { /* ignore */ } }
    };
  }, []);

  // ── Mutators ──────────────────────────────────────────────────────────────

  const addInfluencer = (inf: Omit<Influencer, "id">) => {
    const newInf: Influencer = {
      ...inf,
      id: influencers.length > 0 ? Math.max(...influencers.map((i) => i.id)) + 1 : 1,
    };
    setInfluencers((prev) => [...prev, newInf]);
    toast.success(`${newInf.name} added to Database!`);
  };

  const updateInfluencer = (id: number, inf: Partial<Influencer>) => {
    setInfluencers((prev) =>
      prev.map((i) => (i.id === id ? ({ ...i, ...inf } as Influencer) : i))
    );
    toast.success(`Influencer profile updated!`);
  };

  const deleteInfluencer = (id: number) => {
    const infName = influencers.find((i) => i.id === id)?.name || "Influencer";
    setInfluencers((prev) => prev.filter((i) => i.id !== id));
    toast.error(`${infName} deleted from Database.`);
  };

  const addEnquiry = (enq: Omit<Enquiry, "id" | "status" | "createdDate" | "assignedTo">) => {
    const newEnq: Enquiry = {
      ...enq,
      id: Date.now(),
      status: "Pending",
      assignedTo: "",
      createdDate: new Date().toISOString().split("T")[0],
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    toast.success(`Enquiry submitted successfully!`);
  };

  const updateEnquiryStatus = (id: number, status: Enquiry["status"]) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    toast.message(`Enquiry Status Updated`, { description: `Status changed to ${status}` });
  };

  const deleteEnquiry = (id: number) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    toast.error(`Enquiry deleted.`);
  };

  const addCampaign = (camp: Omit<Campaign, "id">) => {
    const newCamp: Campaign = {
      ...camp,
      id: campaigns.length > 0 ? Math.max(...campaigns.map((c) => c.id)) + 1 : 1,
    };
    setCampaigns((prev) => [...prev, newCamp]);
  };

  return (
    <DataContext.Provider
      value={{
        influencers, enquiries, campaigns, liveStats,
        addInfluencer, updateInfluencer, deleteInfluencer,
        addEnquiry, updateEnquiryStatus, deleteEnquiry, addCampaign,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
