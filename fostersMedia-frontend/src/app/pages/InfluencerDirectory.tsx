import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useInfluencers } from "../../hooks/useInfluencers";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Search,
  MapPin,
  Instagram,
  Youtube,
  Twitter,
  TrendingUp,
  Users,
  Award
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function InfluencerDirectory() {
  const { influencers, isLoading, isError } = useInfluencers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const categories = [
    "All",
    "Lifestyle",
    "Technology",
    "Fashion",
    "Fitness",
  ];

  const filteredInfluencers = influencers.filter((influencer) => {
    // Only display active influencers in public directory
    if (influencer.status && influencer.status.toLowerCase() !== "active") return false;

    const matchesSearch = influencer.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "all" ||
      influencer.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesLocation =
      selectedLocation === "all" ||
      (influencer.city || "").toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-white/70">
        Loading creators...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-white/70">
        Unable to load creators at this time.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative">
      {/* Background radial flare */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-glow-radial rounded-full blur-[120px] opacity-35 pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gradient-rose">
          Discover <span className="text-gradient-accent">Top Talent</span>
        </h1>
        <p className="text-base text-white/50 max-w-xl mx-auto leading-relaxed">
          Browse our curated, verified ecosystem of content creators. Connect, build campaigns, and drive engagement.
        </p>
      </motion.div>

      {/* Search and Filters panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="glass-panel p-5 border-white/5 mb-12 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by creator name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 bg-white/5 border-white/5 rounded-full h-11 focus:border-[#FF6A88]/50 placeholder-white/30 text-white"
              />
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-white/5 border-white/5 rounded-full h-11 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B0C10] border-white/10 text-white">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.slice(1).map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="bg-white/5 border-white/5 rounded-full h-11 text-white">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-[#0B0C10] border-white/10 text-white">
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="new york">New York</SelectItem>
              <SelectItem value="san francisco">San Francisco</SelectItem>
              <SelectItem value="london">London</SelectItem>
              <SelectItem value="paris">Paris</SelectItem>
              <SelectItem value="miami">Miami</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-white/50">
          <span className="font-semibold uppercase tracking-wider text-[10px] text-white/30">Suggestions:</span>
          <button 
            onClick={() => setSearchQuery("Sarah")} 
            className="px-3 py-1 bg-white/5 hover:bg-[#FF6A88]/20 hover:text-white rounded-full transition-colors"
          >
            Sarah Anderson
          </button>
          <button 
            onClick={() => setSelectedCategory("technology")} 
            className="px-3 py-1 bg-white/5 hover:bg-[#FF6A88]/20 hover:text-white rounded-full transition-colors"
          >
            Tech Reviewers
          </button>
          <button 
            onClick={() => { setSelectedCategory("all"); setSelectedLocation("all"); setSearchQuery(""); }} 
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/70 rounded-full transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </motion.div>

      {/* Influencers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredInfluencers.map((influencer, index) => (
          <motion.div
            key={influencer.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="glass-panel glass-panel-hover border-white/5 overflow-hidden flex flex-col group"
          >
            <Link to={`/influencers/${influencer.id}`} className="block relative overflow-hidden aspect-[4/5] bg-white/5">
              <ImageWithFallback
                src={influencer.profileImage}
                alt={influencer.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Cover Gradient shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-transparent opacity-80" />

              {/* Glowing Vetted Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-[#FF6A88]" />
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-wide">Vetted</span>
              </div>

              {/* Pulse status indicator */}
              <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/5 text-[10px] font-semibold text-white/95 font-mono select-none">
                <span className="relative flex h-1.5 w-1.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    influencer.availability === "available" ? "bg-emerald-400" : "bg-amber-400"
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                    influencer.availability === "available" ? "bg-emerald-500" : "bg-amber-500"
                  }`}></span>
                </span>
                <span>{influencer.availability === "available" ? "AVAILABLE" : "ON CAMPAIGN"}</span>
              </div>
            </Link>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#FF6A88] uppercase block mb-1">
                  {influencer.category}
                </span>
                <Link to={`/influencers/${influencer.id}`}>
                  <h3 className="text-xl font-bold tracking-tight text-white hover:text-[#FF6A88] transition-colors line-clamp-1">
                    {influencer.name}
                  </h3>
                </Link>
                <div className="flex items-center text-xs text-white/40 mt-1">
                  <MapPin className="w-3 h-3 mr-1 text-[#FF8E53]" />
                  {influencer.location}
                </div>
              </div>

              {/* Mini analytics row */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-white/5 font-mono">
                <div>
                  <span className="text-[10px] text-white/30 uppercase block">Followers</span>
                  <span className="font-bold text-white text-sm">
                    {(() => {
                      const f = influencer.followers;
                      const total = (f?.instagram || 0) + (f?.youtube || 0) + (f?.twitter || 0) + (f?.tiktok || 0);
                      if (total >= 1_000_000) return `${(total / 1_000_000).toFixed(1)}M`;
                      if (total >= 1_000) return `${(total / 1_000).toFixed(1)}K`;
                      return total > 0 ? String(total) : "—";
                    })()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase block">Engage Ratio</span>
                  <span className="font-bold text-[#FF8E53] text-sm">{influencer.engagementRate ? `${influencer.engagementRate}%` : "—"}</span>
                </div>
              </div>

              {/* Social Channels & Action */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex space-x-2.5 text-white/40">
                  {influencer.socialLinks?.instagram && <Instagram className="w-4 h-4 hover:text-white transition-colors" />}
                  {influencer.socialLinks?.youtube && <Youtube className="w-4 h-4 hover:text-white transition-colors" />}
                  {influencer.socialLinks?.twitter && <Twitter className="w-4 h-4 hover:text-white transition-colors" />}
                </div>
                
                <Link to={`/influencers/${influencer.id}`}>
                  <Button className="h-9 px-4 text-xs font-semibold bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white rounded-full hover:opacity-95">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredInfluencers.length === 0 && (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
          <p className="text-white/40 font-medium">No active creators match the selected criteria.</p>
        </div>
      )}
    </div>
  );
}
