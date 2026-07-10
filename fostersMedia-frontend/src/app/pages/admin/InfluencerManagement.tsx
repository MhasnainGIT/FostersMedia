import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useInfluencers } from "../../../hooks/useInfluencers";
import { Influencer } from "../../../types";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Search, Plus, Edit, Trash2, MoreVertical, X, Sparkles, Phone, Mail, CheckCircle, XCircle, Clock, UserCheck, Download, ImagePlus, Upload } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "../../components/ui/dropdown-menu";
import { influencerService } from "../../../services/influencerService";
import { toast } from "sonner";

const CATEGORIES = ["Lifestyle","Technology","Fashion","Fitness","Travel","Food","Beauty","Gaming","Finance","Education"];

const formatFollowers = (f: Influencer["followers"]) => {
  if (!f) return "—";
  const total = (f.instagram || 0) + (f.youtube || 0) + (f.twitter || 0) + (f.tiktok || 0);
  if (total >= 1_000_000) return `${(total / 1_000_000).toFixed(1)}M`;
  if (total >= 1_000) return `${(total / 1_000).toFixed(1)}K`;
  return total > 0 ? String(total) : "—";
};

const availCls = (a: string) => ({
  available:   "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  busy:        "bg-amber-500/10  text-amber-400  border border-amber-500/20",
  unavailable: "bg-red-500/10    text-red-400    border border-red-500/20",
}[a.toLowerCase()] ?? "bg-white/5 text-white/40 border border-white/10");

const statusCls = (s: string) =>
  s?.toLowerCase() === "active"
    ? "bg-[#FF6A88]/10 text-[#FF6A88] border border-[#FF6A88]/20"
    : "bg-white/5 text-white/40 border border-white/10";

const SEL = "w-full bg-white/5 border border-white/5 rounded-xl h-10 px-3 text-sm focus:outline-none focus:border-[#FF6A88]/50 text-white";

const blank = () => ({
  name: "", category: "Lifestyle", engagementRate: "", city: "",
  phone: "", email: "", bio: "", profileImage: "",
  availability: "available" as Influencer["availability"],
  status: "active" as Influencer["status"],
  socialLinks: { instagram: "", youtube: "", twitter: "", tiktok: "", website: "" },
});

export function InfluencerManagement() {
  const { influencers, addInfluencer, updateInfluencer, deleteInfluencer, isLoading } = useInfluencers();
  const queryClient = useQueryClient();

  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [avFilter, setAvFilter]   = useState("all");
  const [stFilter, setStFilter]   = useState("all");
  const [addOpen, setAddOpen]     = useState(false);
  const [editOpen, setEditOpen]   = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [f, setF]                 = useState(blank());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAdd = () => { 
    setF(blank()); 
    resetImageState(); 
    setAddOpen(true); 
  };

  const openEdit = (inf: Influencer) => {
    setEditId(inf.id);
    setF({
      name:          inf.name,
      category:      inf.category,
      engagementRate: String(inf.engagementRate ?? ""),
      city:          inf.city || "",
      phone:         inf.phone || "",
      email:         inf.email || "",
      bio:           inf.bio || "",
      profileImage:  inf.profileImage || "",
      availability:  inf.availability,
      status:        inf.status || "active",
      socialLinks:   inf.socialLinks || { instagram: "", youtube: "", twitter: "", tiktok: "", website: "" },
    });
    setImagePreview(inf.profileImage || "");
    setImageFile(null);
    setEditOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    } else {
      setImagePreview("");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    try {
      await influencerService.createInfluencerWithFiles({
        name: f.name.trim(), category: f.category, city: f.city,
        phone: f.phone, email: f.email, bio: f.bio,
        engagementRate: parseFloat(f.engagementRate) || 0,
        availability: f.availability, status: f.status,
        socialLinks: f.socialLinks || {},
        languages: ["English"], followers: { instagram: 0, youtube: 0, twitter: 0, tiktok: 0 },
      }, imageFile || undefined);
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
      toast.success(`${f.name.trim()} added to Database!`);
      setAddOpen(false);
      resetImageState();
    } catch (err) {
      toast.error("Failed to add creator", { description: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !f.name.trim()) return;
    try {
      await influencerService.updateInfluencerWithFiles(editId, {
        name: f.name.trim(), category: f.category, city: f.city,
        phone: f.phone, email: f.email, bio: f.bio,
        engagementRate: parseFloat(f.engagementRate) || 0,
        availability: f.availability, status: f.status,
        socialLinks: f.socialLinks || {},
      }, imageFile || undefined);
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
      toast.success("Creator profile updated!");
      setEditOpen(false);
      setEditId(null);
      resetImageState();
    } catch (err) {
      toast.error("Failed to update creator", { description: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  const setAvail  = (id: string, v: Influencer["availability"]) => updateInfluencer(id, { availability: v });
  const setStatus = (id: string, v: Influencer["status"])       => updateInfluencer(id, { status: v });
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}" permanently?`)) deleteInfluencer(id);
  };

  const exportToCSV = () => {
    if (!influencers.length) return;
    const headers = ["ID","Name","Category","City","Phone","Email","Followers","Engagement","Availability","Status"];
    const rows = influencers.map(inf => [
      inf.id, `"${inf.name}"`, `"${inf.category}"`, `"${inf.city}"`,
      `"${inf.phone || ""}"`, `"${inf.email || ""}"`,
      `"${formatFollowers(inf.followers)}"`, `"${inf.engagementRate ?? 0}%"`,
      inf.availability, inf.status
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `creators_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const list = influencers.filter((inf) => {
    const q = search.toLowerCase();
    const matchQ = inf.name.toLowerCase().includes(q) || inf.category.toLowerCase().includes(q) ||
      (inf.city || "").toLowerCase().includes(q) || (inf.phone || "").includes(q) || (inf.email || "").toLowerCase().includes(q);
    const matchCat = catFilter === "all" || inf.category === catFilter;
    const matchAv  = avFilter  === "all" || inf.availability?.toLowerCase() === avFilter.toLowerCase();
    const matchSt  = stFilter  === "all" || inf.status?.toLowerCase() === stFilter.toLowerCase();
    return matchQ && matchCat && matchAv && matchSt;
  });

  const formFields = (prefix: string) => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor={`${prefix}-name`} className="text-white/70 text-xs font-semibold uppercase tracking-wider">Full Name *</Label>
        <Input id={`${prefix}-name`} required placeholder="e.g. Sarah Anderson"
          value={f.name} onChange={(e) => set("name", e.target.value)}
          className="bg-white/5 border-white/10 rounded-xl h-11 text-white placeholder-white/20 focus:border-[#FF6A88]/50 focus:ring-0" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-cat`} className="text-white/70 text-xs font-semibold uppercase tracking-wider">Category *</Label>
          <select id={`${prefix}-cat`} value={f.category} onChange={(e) => set("category", e.target.value)} className={SEL}>
            {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0E1015]">{c}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-eng`} className="text-white/70 text-xs font-semibold uppercase tracking-wider">Engagement Rate %</Label>
          <Input id={`${prefix}-eng`} placeholder="e.g. 4.5"
            value={f.engagementRate} onChange={(e) => set("engagementRate", e.target.value)}
            className="bg-white/5 border-white/10 rounded-xl h-11 text-white placeholder-white/20 focus:border-[#FF6A88]/50 focus:ring-0" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-city`} className="text-white/70 text-xs font-semibold uppercase tracking-wider">City / Location</Label>
          <Input id={`${prefix}-city`} placeholder="e.g. Mumbai, India"
            value={f.city} onChange={(e) => set("city", e.target.value)}
            className="bg-white/5 border-white/10 rounded-xl h-11 text-white placeholder-white/20 focus:border-[#FF6A88]/50 focus:ring-0" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-phone`} className="text-white/70 text-xs font-semibold uppercase tracking-wider">
            <Phone className="w-3 h-3 inline mr-1 text-[#FF6A88]" />Contact Number
          </Label>
          <Input id={`${prefix}-phone`} type="tel" placeholder="+91 98765 43210"
            value={f.phone} onChange={(e) => set("phone", e.target.value)}
            className="bg-white/5 border-white/10 rounded-xl h-11 text-white placeholder-white/20 focus:border-[#FF6A88]/50 focus:ring-0" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${prefix}-email`} className="text-white/70 text-xs font-semibold uppercase tracking-wider">
          <Mail className="w-3 h-3 inline mr-1 text-[#FF8E53]" />Email ID
        </Label>
        <Input id={`${prefix}-email`} type="email" placeholder="creator@email.com"
          value={f.email} onChange={(e) => set("email", e.target.value)}
          className="bg-white/5 border-white/10 rounded-xl h-11 text-white placeholder-white/20 focus:border-[#FF6A88]/50 focus:ring-0" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-avail`} className="text-white/70 text-xs font-semibold uppercase tracking-wider">Availability</Label>
          <select id={`${prefix}-avail`} value={f.availability} onChange={(e) => set("availability", e.target.value)} className={SEL}>
            <option value="available" className="bg-[#0E1015]">Available</option>
            <option value="busy" className="bg-[#0E1015]">Busy</option>
            <option value="unavailable" className="bg-[#0E1015]">Unavailable</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-status`} className="text-white/70 text-xs font-semibold uppercase tracking-wider">Status</Label>
          <select id={`${prefix}-status`} value={f.status} onChange={(e) => set("status", e.target.value)} className={SEL}>
            <option value="active" className="bg-[#0E1015]">Active</option>
            <option value="inactive" className="bg-[#0E1015]">Inactive</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">Profile Image</Label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-colors h-36
            ${imagePreview ? "border-[#FF6A88]/50 bg-[#FF6A88]/5" : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"}`}>
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-60" />
              <div className="relative z-10 flex flex-col items-center gap-1">
                <Upload className="w-5 h-5 text-white/80" />
                <span className="text-xs text-white/70">{imageFile ? imageFile.name : "Click or drag to replace"}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImagePlus className="w-7 h-7 text-white/30" />
              <span className="text-xs text-white/40">Drop image here or click to upload</span>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-white/70 text-xs font-semibold uppercase tracking-wider">Social Links</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            { key: "instagram", placeholder: "Instagram URL" },
            { key: "youtube", placeholder: "YouTube URL" },
            { key: "twitter", placeholder: "Twitter / X URL" },
            { key: "website", placeholder: "Website URL" },
          ].map(({ key, placeholder }) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={`${prefix}-social-${key}`} className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{key}</Label>
              <Input id={`${prefix}-social-${key}`} placeholder={placeholder}
                value={(f.socialLinks as any)?.[key] || ""}
                onChange={(e) => setF((p) => ({ ...p, socialLinks: { ...(p.socialLinks as any), [key]: e.target.value } }))}
                className="bg-white/5 border-white/10 rounded-xl h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50 focus:ring-0" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${prefix}-bio`} className="text-white/70 text-xs font-semibold uppercase tracking-wider">Biography</Label>
        <Textarea id={`${prefix}-bio`} placeholder="Brief creator description..."
          value={f.bio} onChange={(e) => set("bio", e.target.value)}
          className="bg-white/5 border-white/10 rounded-xl min-h-[90px] text-white placeholder-white/20 focus:border-[#FF6A88]/50 focus:ring-0" />
      </div>
    </div>
  );

  const panel = (key: string, open: boolean, title: string, formId: string, onSubmit: (e: React.FormEvent) => void, onClose: () => void, submitLabel: string) =>
    open ? (
      <div key={key} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-end">
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          className="w-full max-w-lg h-full bg-[#0D0F14] border-l border-white/10 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 px-8 py-5 flex-shrink-0 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF6A88]" /> {title}
            </h3>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <form id={formId} onSubmit={onSubmit}>{formFields(formId)}</form>
          </div>
          <div className="flex gap-3 px-8 py-5 border-t border-white/5 flex-shrink-0 bg-white/[0.02]">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 rounded-xl border-white/10 hover:bg-white/5 h-11 text-white">Cancel</Button>
            <Button type="submit" form={formId} className="flex-1 bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white font-bold rounded-xl h-11 shadow-lg shadow-[#FF6A88]/20">{submitLabel}</Button>
          </div>
        </motion.div>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Creator Database</h1>
          <p className="text-sm text-white/40 mt-1">Manage profiles, contact details, availability & status.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToCSV} variant="outline" className="border-white/10 hover:bg-white/5 text-white rounded-xl h-10 px-4 font-bold text-sm">
            <Download className="w-4 h-4 mr-2 text-[#FFB199]" /> Export to Excel
          </Button>
          <Button onClick={openAdd} className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white rounded-xl h-10 px-5 font-bold text-sm shadow-md shadow-[#FF6A88]/20">
            <Plus className="w-4 h-4 mr-2" /> Add Creator
          </Button>
        </div>
      </div>

      <div className="glass-panel p-4 border-white/5 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
          <Input placeholder="Search name, phone, email, city..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-11 bg-white/5 border-white/5 rounded-full h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50" />
        </div>
        <div className="flex gap-3 flex-wrap">
          {[
            { val: catFilter, set: setCatFilter, opts: ["all", ...CATEGORIES], label: "Category" },
            { val: avFilter,  set: setAvFilter,  opts: ["all","available","busy","unavailable"], label: "Availability" },
            { val: stFilter,  set: setStFilter,  opts: ["all","active","inactive"], label: "Status" },
          ].map(({ val, set: setFn, opts, label }) => (
            <select key={label} value={val} onChange={(e) => setFn(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full h-10 px-4 text-sm text-white min-w-[130px]">
              <option value="all">All {label}</option>
              {opts.filter(o => o !== "all").map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
          ))}
        </div>
        <span className="text-xs text-white/30 font-mono whitespace-nowrap ml-auto">{list.length} / {influencers.length} creators</span>
      </div>

      <div className="glass-panel border-white/5 overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-14 text-white/30">Loading creators...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                {["Creator","Category","Followers","Location","Contact Number","Email ID","Availability","Status","Actions"].map((h, i) => (
                  <TableHead key={h} className={`text-white/40 font-bold tracking-widest uppercase text-[10px] py-3${i === 8 ? " text-right pr-6" : ""}`}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((inf) => (
                <TableRow key={inf.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 rounded-xl border border-white/10 flex-shrink-0">
                        {inf.profileImage ? (
                          <img src={inf.profileImage} alt={inf.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-[#FF6A88] to-[#FF8E53] text-white font-bold text-sm rounded-xl">
                            {inf.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm leading-tight truncate">{inf.name}</p>
                        <p className="text-white/30 text-[10px] truncate">{inf.city || "—"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-white/60 text-xs font-medium">{inf.category}</span></TableCell>
                  <TableCell><span className="text-[#FF8E53] font-bold font-mono text-sm">{formatFollowers(inf.followers)}</span></TableCell>
                  <TableCell><span className="text-white/50 text-xs">{inf.city || "—"}</span></TableCell>
                  <TableCell>
                    {inf.phone ? (
                      <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-[#FF6A88] flex-shrink-0" /><span className="text-white/70 text-xs font-mono">{inf.phone}</span></div>
                    ) : <span className="text-white/20 text-xs">—</span>}
                  </TableCell>
                  <TableCell>
                    {inf.email ? (
                      <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-[#FF8E53] flex-shrink-0" /><span className="text-white/70 text-xs truncate max-w-[150px]">{inf.email}</span></div>
                    ) : <span className="text-white/20 text-xs">—</span>}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${availCls(inf.availability)}`}>
                      {inf.availability}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusCls(inf.status || "")}`}>
                      {inf.status || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-white/10 transition-opacity">
                          <MoreVertical className="w-4 h-4 text-white/70 group-hover:text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="z-50 bg-[#0D0F14] border border-white/10 text-white shadow-2xl min-w-[200px] rounded-xl p-1">
                        <DropdownMenuLabel className="text-white/30 text-[9px] font-bold uppercase tracking-widest px-2 pt-1 pb-0.5">Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEdit(inf)} className="flex items-center gap-2.5 hover:bg-white/5 cursor-pointer rounded-lg text-sm text-white/80 hover:text-white px-2 py-2">
                          <Edit className="w-4 h-4 text-[#FF8E53]" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(inf.id, inf.name)} className="flex items-center gap-2.5 hover:bg-red-500/10 cursor-pointer rounded-lg text-sm text-red-400 hover:text-red-300 px-2 py-2">
                          <Trash2 className="w-4 h-4" /> Delete Creator
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5 my-1" />
                        <DropdownMenuLabel className="text-white/30 text-[9px] font-bold uppercase tracking-widest px-2 pt-1 pb-0.5">Set Availability</DropdownMenuLabel>
                        {(["available","busy","unavailable"] as const).map((a) => (
                          <DropdownMenuItem key={a} onClick={() => setAvail(inf.id, a)}
                            className={`flex items-center gap-2.5 cursor-pointer rounded-lg text-sm px-2 py-2 ${inf.availability === a ? a === "available" ? "text-emerald-400 bg-emerald-500/5" : a === "busy" ? "text-amber-400 bg-amber-500/5" : "text-red-400 bg-red-500/5" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
                            {a === "available" ? <CheckCircle className="w-4 h-4"/> : a === "busy" ? <Clock className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                            {a.charAt(0).toUpperCase() + a.slice(1)}
                            {inf.availability === a && <span className="ml-auto text-[10px] opacity-60">current</span>}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className="bg-white/5 my-1" />
                        <DropdownMenuLabel className="text-white/30 text-[9px] font-bold uppercase tracking-widest px-2 pt-1 pb-0.5">Set Status</DropdownMenuLabel>
                        {(["active","inactive"] as const).map((s) => (
                          <DropdownMenuItem key={s} onClick={() => setStatus(inf.id, s)}
                            className={`flex items-center gap-2.5 cursor-pointer rounded-lg text-sm px-2 py-2 ${inf.status === s ? s === "active" ? "text-[#FF6A88] bg-[#FF6A88]/5" : "text-white/40 bg-white/5" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
                            {s === "active" ? <UserCheck className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                            {inf.status === s && <span className="ml-auto text-[10px] opacity-60">current</span>}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-14">
                    <div className="flex flex-col items-center gap-3 text-white/20">
                      <Search className="w-8 h-8" />
                      <p className="text-sm font-medium">No creators found.</p>
                      <p className="text-xs">Click <span className="text-[#FF6A88]">Add Creator</span> to register one.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <AnimatePresence>
        {panel("add", addOpen, "Register Creator", "add-creator-form", handleAdd, () => { setAddOpen(false); resetImageState(); }, "Add to Database")}
        {panel("edit", editOpen, "Edit Creator Profile", "edit-creator-form", handleEdit, () => { setEditOpen(false); setEditId(null); resetImageState(); }, "Save Changes")}
      </AnimatePresence>
    </div>
  );
}
