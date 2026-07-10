import { useParams, Link } from "react-router";
import { useState, useRef } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../../store/authStore";
import { useInfluencerById } from "../../hooks/useInfluencers";
import { influencerService } from "../../services/influencerService";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import {
  Instagram, Youtube, Twitter, MapPin, Globe, Sparkles,
  ArrowLeft, Edit, X, Check, Phone, Mail, Languages,
  TrendingUp, Users, Star, Clock, Upload, ImagePlus
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const NA = "Unavailable";
const val = (v?: string | number | null) => (v !== undefined && v !== null && String(v).trim() !== "" ? String(v) : NA);
const listVal = (arr?: string[]) => (arr && arr.length > 0 ? arr.join(", ") : NA);

const formatFollowers = (f?: { instagram?: number; youtube?: number; twitter?: number; tiktok?: number }) => {
  if (!f) return NA;
  const total = (f.instagram || 0) + (f.youtube || 0) + (f.twitter || 0) + (f.tiktok || 0);
  if (total === 0) return NA;
  if (total >= 1_000_000) return `${(total / 1_000_000).toFixed(1)}M`;
  if (total >= 1_000) return `${(total / 1_000).toFixed(1)}K`;
  return String(total);
};

export function InfluencerProfile() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  const { data: influencer, isLoading, isError } = useInfluencerById(id || "");

  // Determine if the logged-in user owns this influencer profile
  const isOwner = isAuthenticated && user && influencer && (
    (user.accountType === "influencer") &&
    (user.name === influencer.name || (user.email && influencer.email && user.email === influencer.email))
  );

  // Edit panel state
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", bio: "", category: "", languages: "",
    city: "", country: "", phone: "", email: "",
    instagram: "", youtube: "", twitter: "", tiktok: "", website: "",
    availability: "available", status: "active",
    instagramFollowers: "", youtubeFollowers: "", twitterFollowers: "", tiktokFollowers: "",
    engagementRate: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEdit = () => {
    if (!influencer) return;
    setForm({
      name: influencer.name || "",
      bio: influencer.bio || "",
      category: influencer.category || "",
      languages: (influencer.languages || []).join(", "),
      city: influencer.city || "",
      country: (influencer as any).country || "",
      phone: influencer.phone || "",
      email: influencer.email || "",
      instagram: influencer.socialLinks?.instagram || "",
      youtube: influencer.socialLinks?.youtube || "",
      twitter: influencer.socialLinks?.twitter || "",
      tiktok: influencer.socialLinks?.tiktok || "",
      website: influencer.socialLinks?.website || "",
      availability: influencer.availability || "available",
      status: influencer.status || "active",
      instagramFollowers: String(influencer.followers?.instagram || ""),
      youtubeFollowers: String(influencer.followers?.youtube || ""),
      twitterFollowers: String(influencer.followers?.twitter || ""),
      tiktokFollowers: String(influencer.followers?.tiktok || ""),
      engagementRate: String(influencer.engagementRate || ""),
    });
    setImageFile(null);
    setImagePreview(influencer.profileImage || "");
    setEditOpen(true);
  };

  const applyFile = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) applyFile(file);
  };

  const selfUpdateMutation = useMutation({
    mutationFn: (data: any) => influencerService.selfUpdateInfluencer(id!, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["influencer", id], updated);
      queryClient.invalidateQueries({ queryKey: ["influencers"] });
      toast.success("Profile updated successfully.");
      setEditOpen(false);
    },
    onError: (err: any) => toast.error("Update failed", { description: err.message }),
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    let profileImage: string | undefined;

    // If a file was selected, upload it first
    if (imageFile && id) {
      try {
        const uploaded = await influencerService.uploadProfileImage(id, imageFile);
        profileImage = uploaded.profileImage || undefined;
      } catch (err: any) {
        toast.error("Image upload failed", { description: err.message });
        return;
      }
    }

    selfUpdateMutation.mutate({
      name: form.name,
      bio: form.bio,
      category: form.category,
      languages: form.languages.split(",").map(l => l.trim()).filter(Boolean),
      city: form.city,
      country: form.country,
      phone: form.phone,
      availability: form.availability,
      status: form.status,
      engagementRate: parseFloat(form.engagementRate) || 0,
      ...(profileImage && { profileImage }),
      socialLinks: {
        instagram: form.instagram,
        youtube: form.youtube,
        twitter: form.twitter,
        tiktok: form.tiktok,
        website: form.website,
      },
      followers: {
        instagram: parseInt(form.instagramFollowers) || 0,
        youtube: parseInt(form.youtubeFollowers) || 0,
        twitter: parseInt(form.twitterFollowers) || 0,
        tiktok: parseInt(form.tiktokFollowers) || 0,
      },
    });
  };


  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-6 py-24 text-center text-white/70">Loading profile...</div>;
  }

  if (isError || !influencer) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-bold text-white">Creator Profile Not Found</h2>
        <Link to="/influencers" className="text-[#FF6A88] hover:underline mt-4 inline-block">Return to Directory</Link>
      </div>
    );
  }

  const availColor = influencer.availability === "available" ? "text-emerald-400" : influencer.availability === "busy" ? "text-amber-400" : "text-red-400";

  return (
    <div className="relative overflow-hidden pb-24">
      {/* Cover Banner */}
      <div className="relative h-[280px] md:h-[360px] w-full bg-slate-900 overflow-hidden">
        <ImageWithFallback src={influencer.coverImage || influencer.profileImage || ""} alt={influencer.name} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/40 to-transparent" />
        <div className="absolute top-6 left-6 z-20">
          <Link to="/influencers" className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 transition-colors text-sm text-white/90">
            <ArrowLeft className="w-4 h-4" /><span>Back to Talents</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-28 relative z-10">
        <div className="grid grid-cols-1 gap-8 items-start">

          {/* Left Column */}
          <div className="space-y-8">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row gap-6 items-start md:items-end pb-6 border-b border-white/5">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden border-4 border-[#08090C] shadow-2xl bg-white/5 flex-shrink-0">
                <ImageWithFallback src={influencer.profileImage || ""} alt={influencer.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FF6A88]/10 border border-[#FF6A88]/20 text-[11px] font-semibold text-[#FF6A88] uppercase tracking-wide">
                  <Sparkles className="w-3 h-3" /><span>{val(influencer.category)} Creator</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">{influencer.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-[#FF8E53]" />{val(influencer.city)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Languages className="w-4 h-4" />{listVal(influencer.languages)}</span>
                </div>
                {isOwner && (
                  <Button onClick={openEdit} size="sm" className="mt-2 bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white rounded-full px-4 h-8 text-xs font-semibold">
                    <Edit className="w-3 h-3 mr-1.5" /> Edit My Profile
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Followers", value: formatFollowers(influencer.followers), icon: <Users className="w-4 h-4 text-[#FF6A88]" /> },
                { label: "Engagement Rate", value: influencer.engagementRate ? `${influencer.engagementRate}%` : NA, icon: <TrendingUp className="w-4 h-4 text-[#FF8E53]" /> },
                { label: "Availability", value: influencer.availability ? influencer.availability.charAt(0).toUpperCase() + influencer.availability.slice(1) : NA, icon: <Clock className="w-4 h-4 text-emerald-400" />, valueClass: availColor },
                { label: "Verified", value: influencer.isVerified ? "Verified" : "Not Verified", icon: <Star className="w-4 h-4 text-yellow-400" /> },
              ].map(({ label, value, icon, valueClass }) => (
                <div key={label} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-white/40">{icon}<span className="text-[10px] font-bold uppercase tracking-wider">{label}</span></div>
                  <span className={`text-lg font-bold font-mono block ${valueClass || "text-white"} ${value === NA ? "text-white/30 text-sm" : ""}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white">About</h3>
              <p className={`text-sm leading-relaxed ${influencer.bio ? "text-white/70" : "text-white/30 italic"}`}>
                {influencer.bio || NA}
              </p>
            </div>

            {/* Platform Followers Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white">Platform Reach</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Instagram", key: "instagram", color: "text-pink-400", icon: <Instagram className="w-4 h-4" /> },
                  { label: "YouTube", key: "youtube", color: "text-red-400", icon: <Youtube className="w-4 h-4" /> },
                  { label: "Twitter", key: "twitter", color: "text-sky-400", icon: <Twitter className="w-4 h-4" /> },
                  { label: "TikTok", key: "tiktok", color: "text-white/70", icon: <span className="text-xs font-bold">TT</span> },
                ].map(({ label, key, color, icon }) => {
                  const count = influencer.followers?.[key as keyof typeof influencer.followers];
                  const display = count && count > 0 ? (count >= 1000 ? `${(count / 1000).toFixed(1)}K` : String(count)) : NA;
                  return (
                    <div key={key} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                      <div className={`flex items-center gap-1.5 ${color}`}>{icon}<span className="text-xs font-semibold">{label}</span></div>
                      <span className={`text-lg font-bold font-mono ${display === NA ? "text-white/30 text-sm" : "text-white"}`}>{display}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white">Social Links</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Instagram", href: influencer.socialLinks?.instagram, icon: <Instagram className="w-4 h-4" /> },
                  { label: "YouTube", href: influencer.socialLinks?.youtube, icon: <Youtube className="w-4 h-4" /> },
                  { label: "Twitter", href: influencer.socialLinks?.twitter, icon: <Twitter className="w-4 h-4" /> },
                  { label: "Website", href: influencer.socialLinks?.website, icon: <Globe className="w-4 h-4" /> },
                ].map(({ label, href, icon }) => (
                  href ? (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm">
                      {icon}{label}
                    </a>
                  ) : (
                    <span key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 text-white/20 text-sm">
                      {icon}{label} — {NA}
                    </span>
                  )
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white">Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <Mail className="w-4 h-4 text-[#FF6A88] flex-shrink-0" />
                  <span className={`text-sm font-mono ${influencer.email ? "text-white/70" : "text-white/30 italic"}`}>{val(influencer.email)}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <Phone className="w-4 h-4 text-[#FF8E53] flex-shrink-0" />
                  <span className={`text-sm font-mono ${influencer.phone ? "text-white/70" : "text-white/30 italic"}`}>{val(influencer.phone)}</span>
                </div>
              </div>
            </div>

          </div>


        </div>
      </div>

      {/* Edit Profile Slide Panel — only for owner */}
      <AnimatePresence>
        {editOpen && isOwner && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-end">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-full max-w-lg h-full bg-[#0D0F14] border-l border-white/10 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 px-8 py-5 flex-shrink-0">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF6A88]" /> Edit My Profile
                </h3>
                <button onClick={() => setEditOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6">
                <form id="self-edit-form" onSubmit={handleSave} className="space-y-6">

                  {/* Profile Photo — drag & drop */}
                  <div className="space-y-2">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Profile Photo</Label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-colors h-36
                        ${dragOver ? "border-[#FF6A88] bg-[#FF6A88]/10" : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"}`}>
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-40" onError={() => setImagePreview("")} />
                          <div className="relative z-10 flex flex-col items-center gap-1">
                            <Upload className="w-5 h-5 text-white/60" />
                            <span className="text-xs text-white/50">{imageFile ? imageFile.name : "Click or drag to replace"}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="w-7 h-7 text-white/30" />
                          <span className="text-xs text-white/40">Drop image here or click to upload</span>
                        </>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>

                  {/* Identity */}
                  <div className="space-y-3">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Identity</Label>
                    <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                      className="bg-white/5 border-white/10 rounded-xl h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50" />
                    <Input placeholder="Category (e.g. Fashion, Tech, Fitness)" value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                      className="bg-white/5 border-white/10 rounded-xl h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50" />
                    <Input placeholder="Languages (comma-separated, e.g. English, Hindi)" value={form.languages} onChange={(e) => setForm(p => ({ ...p, languages: e.target.value }))}
                      className="bg-white/5 border-white/10 rounded-xl h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50" />
                    <Textarea placeholder="Tell brands about yourself..." value={form.bio}
                      onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))}
                      className="bg-white/5 border-white/10 rounded-xl min-h-[80px] text-white placeholder-white/20 focus:border-[#FF6A88]/50" />
                  </div>

                  {/* Location & Contact */}
                  <div className="space-y-3">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Location & Contact</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="City" value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))}
                        className="bg-white/5 border-white/10 rounded-xl h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50" />
                      <Input placeholder="Country" value={form.country} onChange={(e) => setForm(p => ({ ...p, country: e.target.value }))}
                        className="bg-white/5 border-white/10 rounded-xl h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                        className="bg-white/5 border-white/10 rounded-xl h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50" />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Status</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <select value={form.availability} onChange={(e) => setForm(p => ({ ...p, availability: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl h-10 px-3 text-sm text-white focus:outline-none focus:border-[#FF6A88]/50">
                        <option value="available" className="bg-[#0E1015]">Available</option>
                        <option value="busy" className="bg-[#0E1015]">Busy</option>
                        <option value="unavailable" className="bg-[#0E1015]">Unavailable</option>
                      </select>
                      <select value={form.status} onChange={(e) => setForm(p => ({ ...p, status: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl h-10 px-3 text-sm text-white focus:outline-none focus:border-[#FF6A88]/50">
                        <option value="active" className="bg-[#0E1015]">Active</option>
                        <option value="inactive" className="bg-[#0E1015]">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-3">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Social Media</Label>
                    {[
                      { key: "instagram", placeholder: "instagram.com/username", icon: <Instagram className="w-4 h-4 text-[#E1306C]" /> },
                      { key: "youtube", placeholder: "youtube.com/@channel", icon: <Youtube className="w-4 h-4 text-[#FF0000]" /> },
                      { key: "twitter", placeholder: "x.com/username", icon: <Twitter className="w-4 h-4 text-[#1DA1F2]" /> },
                      { key: "tiktok", placeholder: "tiktok.com/@username", icon: <span className="text-[11px] font-black text-white/60 w-4 text-center">TT</span> },
                      { key: "website", placeholder: "yourwebsite.com", icon: <Globe className="w-4 h-4 text-white/40" /> },
                    ].map(({ key, placeholder, icon }) => (
                      <div key={key} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl h-10 px-3 focus-within:border-[#FF6A88]/50 transition-colors">
                        {icon}
                        <input
                          type="url"
                          placeholder={placeholder}
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                          className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="space-y-3">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Followers Count</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Instagram", key: "instagramFollowers" },
                        { label: "YouTube", key: "youtubeFollowers" },
                        { label: "Twitter", key: "twitterFollowers" },
                        { label: "TikTok", key: "tiktokFollowers" },
                      ].map(({ label, key }) => (
                        <div key={key} className="space-y-1">
                          <span className="text-[10px] text-white/40">{label}</span>
                          <Input type="number" placeholder="0" value={form[key as keyof typeof form]}
                            onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                            className="bg-white/5 border-white/10 rounded-xl h-9 text-white placeholder-white/20 focus:border-[#FF6A88]/50 text-sm" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-white/40">Engagement Rate (%)</span>
                      <Input type="number" step="0.1" placeholder="e.g. 4.5" value={form.engagementRate}
                        onChange={(e) => setForm(p => ({ ...p, engagementRate: e.target.value }))}
                        className="bg-white/5 border-white/10 rounded-xl h-9 text-white placeholder-white/20 focus:border-[#FF6A88]/50 text-sm" />
                    </div>
                  </div>

                </form>
              </div>

              <div className="flex gap-3 px-8 py-5 border-t border-white/5 flex-shrink-0">
                <Button type="button" onClick={() => setEditOpen(false)} variant="outline" className="flex-1 rounded-xl border-white/10 hover:bg-white/5 h-11 text-white">Cancel</Button>
                <Button type="submit" form="self-edit-form" disabled={selfUpdateMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white font-bold rounded-xl h-11">
                  <Check className="w-4 h-4 mr-1.5" /> {selfUpdateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
