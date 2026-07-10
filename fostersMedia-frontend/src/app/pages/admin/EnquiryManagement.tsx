import { useState } from "react";
import { useEnquiries } from "../../../hooks/useEnquiries";
import { Enquiry } from "../../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Search, Mail, Phone, Eye, Trash2, ArrowUpRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet";

const statusColor = (status: string) => ({
  Pending:     "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Contacted:   "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Negotiating: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  Won:         "bg-green-500/10 text-green-400 border border-green-500/20",
  Lost:        "bg-red-500/10 text-red-400 border border-red-500/20",
}[status] ?? "bg-white/5 text-white/50 border border-white/10");

export function EnquiryManagement() {
  const { enquiries, updateStatus, deleteEnquiry, isLoading } = useEnquiries();
  const [searchQuery, setSearchQuery]       = useState("");
  const [typeFilter, setTypeFilter]         = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const handleStatusChange = (id: string, status: Enquiry["status"]) => {
    updateStatus({ id, status });
    if (selectedEnquiry?.id === id) setSelectedEnquiry(prev => prev ? { ...prev, status } : null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this enquiry?")) { deleteEnquiry(id); setSelectedEnquiry(null); }
  };

  const filtered = enquiries.filter((enq) => {
    const company = enq.brandDetails?.companyName || "";
    const contact = enq.brandDetails?.contactPerson || "";
    const matchQ = company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   enq.campaignType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === "all" ||
      (typeFilter === "event" && enq.campaignType === "Event Management") ||
      (typeFilter === "influencer" && enq.campaignType !== "Event Management");
    return matchQ && matchType;
  });

  const total     = enquiries.length;
  const pending   = enquiries.filter(e => e.status === "Pending").length;
  const contacted = enquiries.filter(e => e.status === "Contacted" || e.status === "Negotiating").length;
  const won       = enquiries.filter(e => e.status === "Won").length;
  const lost      = enquiries.filter(e => e.status === "Lost").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Inbound Enquiries</h1>
          <p className="text-sm text-white/50">Track and respond to advertiser bookings in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-panel border-white/5 p-4 space-y-1">
          <div className="text-2xl font-extrabold text-white font-mono">{total}</div>
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Total Enquiries</div>
        </div>
        <div className="glass-panel border-blue-500/10 p-4 space-y-1 bg-blue-500/[0.02]">
          <div className="text-2xl font-extrabold text-blue-400 font-mono">{pending}</div>
          <div className="text-[10px] text-blue-400/60 font-bold uppercase tracking-wider">Pending Review</div>
        </div>
        <div className="glass-panel border-purple-500/10 p-4 space-y-1 bg-purple-500/[0.02]">
          <div className="text-2xl font-extrabold text-purple-400 font-mono">{contacted}</div>
          <div className="text-[10px] text-purple-400/60 font-bold uppercase tracking-wider">Negotiating</div>
        </div>
        <div className="glass-panel border-green-500/10 p-4 space-y-1 bg-green-500/[0.02]">
          <div className="text-2xl font-extrabold text-green-400 font-mono">{won}</div>
          <div className="text-[10px] text-green-400/60 font-bold uppercase tracking-wider">Won Campaigns</div>
        </div>
        <div className="glass-panel border-red-500/10 p-4 space-y-1 bg-red-500/[0.02]">
          <div className="text-2xl font-extrabold text-red-400 font-mono">{lost}</div>
          <div className="text-[10px] text-red-400/60 font-bold uppercase tracking-wider">Lost / Dropped</div>
        </div>
      </div>

      <div className="glass-panel p-4 border-white/5 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 w-4 h-4" />
          <Input type="text" placeholder="Search enquiries by brand or objective..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-white/5 border-white/5 rounded-full h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-full h-10 px-4 text-sm text-white min-w-[200px] focus:outline-none focus:border-[#FF6A88]/50">
          <option value="all" className="bg-[#0E1015]">All Enquiries</option>
          <option value="influencer" className="bg-[#0E1015]">Hire an Influencer</option>
          <option value="event" className="bg-[#0E1015]">Book an Event</option>
        </select>
      </div>

      <div className="glass-panel border-white/5 overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="text-center py-8 text-white/30">Loading enquiries...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-white/[0.02]">
                <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Brand / Client</TableHead>
                <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Contact Person</TableHead>
                <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Budget</TableHead>
                <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Channel Objective</TableHead>
                <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Date</TableHead>
                <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Status</TableHead>
                <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((enq) => (
                <TableRow key={enq.id} onClick={() => setSelectedEnquiry(enq)}
                  className="border-white/5 hover:bg-white/[0.01] transition-colors cursor-pointer">
                  <TableCell className="font-bold text-white text-sm">{enq.brandDetails?.companyName || "—"}</TableCell>
                  <TableCell className="text-white/70 text-xs">{enq.brandDetails?.contactPerson || "—"}</TableCell>
                  <TableCell className="text-[#FF8E53] font-bold font-mono text-xs">{enq.budget}</TableCell>
                  <TableCell className="text-white/50 text-xs">{enq.campaignType}</TableCell>
                  <TableCell className="text-white/40 font-mono text-xs">{enq.createdDate}</TableCell>
                  <TableCell>
                    <Badge className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${statusColor(enq.status)}`}>
                      {enq.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end space-x-1.5">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg text-white/50 hover:text-white" onClick={() => setSelectedEnquiry(enq)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg text-red-400" onClick={() => handleDelete(enq.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-white/30 font-medium">No enquiries logged in database.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Sheet open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
        <SheetContent className="w-full sm:max-w-md bg-[#0E1015] border-l border-white/10 text-white p-8 overflow-y-auto space-y-6">
          <SheetHeader className="border-b border-white/5 pb-4">
            <SheetTitle className="text-2xl font-bold tracking-tight text-white flex items-center">
              <ArrowUpRight className="w-5 h-5 mr-2 text-[#FF6A88]" /> Enquiry Detail
            </SheetTitle>
          </SheetHeader>
          {selectedEnquiry && (
            <div className="space-y-6 text-sm">
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Company Core</span>
                <div>
                  <h4 className="font-extrabold text-white text-base leading-none">{selectedEnquiry.brandDetails?.companyName || "—"}</h4>
                  <span className="text-xs text-white/50 block mt-1">Representative: {selectedEnquiry.brandDetails?.contactPerson || "—"}</span>
                </div>
                <div className="space-y-1.5 pt-1 text-xs text-white/60 font-mono">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-[#FF6A88]" />
                    <span>{selectedEnquiry.brandDetails?.email || "—"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-[#FF6A88]" />
                    <span>{selectedEnquiry.brandDetails?.phone || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Campaign Terms</span>
                <div className="grid grid-cols-2 gap-4 font-mono">
                  <div>
                    <span className="text-[9px] text-white/30 uppercase block">Budget</span>
                    <span className="text-base font-bold text-[#FF8E53]">{selectedEnquiry.budget}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/30 uppercase block">Log Date</span>
                    <span className="text-xs text-white/70 block pt-0.5">{selectedEnquiry.createdDate}</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-[9px] text-white/30 uppercase block">Category Type</span>
                  <span className="text-xs text-white/70 block pt-0.5 font-semibold">{selectedEnquiry.campaignType}</span>
                </div>
              </div>

              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Proposal Message</span>
                <p className="text-xs text-white/70 leading-relaxed whitespace-pre-line">{selectedEnquiry.message}</p>
              </div>

              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Admin Workflow Pipeline</span>
                <label className="text-[10px] text-white/50 uppercase block font-semibold">Change status</label>
                <select value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value as Enquiry["status"])}
                  className="w-full bg-white/5 border border-white/10 rounded-xl h-10 px-3 text-xs focus:outline-none focus:border-[#FF6A88]/50 text-white">
                  <option value="Pending" className="bg-[#0E1015]">Pending Review</option>
                  <option value="Contacted" className="bg-[#0E1015]">Contacted</option>
                  <option value="Negotiating" className="bg-[#0E1015]">Negotiating</option>
                  <option value="Won" className="bg-[#0E1015]">Won Campaign</option>
                  <option value="Lost" className="bg-[#0E1015]">Lost / Dropped</option>
                </select>
              </div>

              <Button variant="outline" onClick={() => handleDelete(selectedEnquiry.id)}
                className="w-full border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-xl h-11 text-xs font-semibold">
                Delete Enquiry record
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
