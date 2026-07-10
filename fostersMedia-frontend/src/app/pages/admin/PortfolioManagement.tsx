import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { usePortfolio } from "../../../hooks/usePortfolio";
import { PortfolioItem } from "../../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Search, Plus, Edit, Trash2, MoreVertical, X, Award, Target, Sparkles, TrendingUp } from "lucide-react";

const portfolioSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  client: z.string().min(2, "Client name is required"),
  category: z.string().min(2, "Category is required"),
  goal: z.string().min(5, "Campaign goal description is required"),
  services: z.string().min(2, "Provided services are required"),
  image: z.string().optional(),
  impressions: z.string().min(1, "Impressions result required"),
  engagement: z.string().min(1, "Engagement ratio required"),
  sales: z.string().min(1, "Sales lift result required")
});

type PortfolioFields = z.infer<typeof portfolioSchema>;

export function PortfolioManagement() {
  const { portfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem, isAdding, isUpdating } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PortfolioFields>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      client: "",
      category: "",
      goal: "",
      services: "",
      image: "",
      impressions: "",
      engagement: "",
      sales: ""
    }
  });

  const openAddModal = () => {
    reset({
      title: "",
      client: "",
      category: "Influencer Campaign",
      goal: "",
      services: "",
      image: "",
      impressions: "",
      engagement: "",
      sales: ""
    });
    setIsAddOpen(true);
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingId(item.id);
    reset({
      title: item.title,
      client: item.client,
      category: item.category,
      goal: item.goal,
      services: item.services.join(", "),
      image: item.image,
      impressions: item.results.impressions,
      engagement: item.results.engagement,
      sales: item.results.sales
    });
    setIsEditOpen(true);
  };

  const handleAddSubmit = (data: PortfolioFields) => {
    addPortfolioItem({
      title: data.title,
      client: data.client,
      category: data.category,
      goal: data.goal,
      services: data.services.split(",").map((s) => s.trim()).filter(Boolean),
      image: data.image,
      results: {
        impressions: data.impressions,
        engagement: data.engagement,
        sales: data.sales
      }
    });
    setIsAddOpen(false);
  };

  const handleEditSubmit = (data: PortfolioFields) => {
    if (editingId === null) return;
    updatePortfolioItem({
      id: editingId,
      data: {
        title: data.title,
        client: data.client,
        category: data.category,
        goal: data.goal,
        services: data.services.split(",").map((s) => s.trim()).filter(Boolean),
        image: data.image,
        results: {
          impressions: data.impressions,
          engagement: data.engagement,
          sales: data.sales
        }
      }
    });
    setIsEditOpen(false);
    setEditingId(null);
  };

  const handleDeleteClick = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete case study "${title}"?`)) {
      deletePortfolioItem(id);
    }
  };

  const filtered = portfolio.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Case Studies Portfolio</h1>
          <p className="text-sm text-white/50">Manage published brand campaign success stories and metrics.</p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white rounded-xl h-10 px-5 font-semibold text-sm shadow-md shadow-primary/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Case Study
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by campaign title, client or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-white/5 border-white/5 rounded-full h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50"
          />
        </div>
        
        <div className="text-xs text-white/40 font-mono">
          Total Case Studies: {filtered.length}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel border-white/5 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-white/[0.02]">
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Client / Campaign</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Category</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Impressions</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Engagement</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Sales Lift</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id} className="border-white/5 hover:bg-white/[0.015] transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">{item.title}</span>
                      <span className="text-[10px] text-white/40 block">Client: {item.client}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-white/70 text-xs">{item.category}</TableCell>
                <TableCell className="text-emerald-400 font-bold font-mono text-xs">{item.results.impressions}</TableCell>
                <TableCell className="text-white/70 font-mono text-xs">{item.results.engagement}</TableCell>
                <TableCell className="text-[#FF8E53] font-bold font-mono text-xs">{item.results.sales}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-white/50 hover:text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-50 bg-[#0B0C10] border-white/10 text-white">
                      <DropdownMenuItem onClick={() => openEditModal(item)} className="hover:bg-white/5 cursor-pointer">
                        <Edit className="w-4 h-4 mr-2 text-[#FF8E53]" />
                        Edit Case Study
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(item.id, item.title)} className="hover:bg-white/5 cursor-pointer text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete record
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-white/30 font-medium">
                  No portfolio case studies resolved.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Sliding Glass Modals */}
      <AnimatePresence>
        {(isAddOpen || isEditOpen) && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg h-full bg-[#0E1015] border-l border-white/10 p-8 overflow-y-auto space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-2xl font-bold tracking-tight text-white flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-[#FF6A88]" />
                    {isAddOpen ? "Add Case Study" : "Edit Case Study Settings"}
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddOpen(false);
                      setIsEditOpen(false);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  id="portfolio-form"
                  onSubmit={handleSubmit(isAddOpen ? handleAddSubmit : handleEditSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="client">Client Name</Label>
                      <Input
                        id="client"
                        placeholder="e.g. Nike"
                        {...register("client")}
                        className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                      />
                      {errors.client && <p className="text-xs text-red-400">{errors.client.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="category">Campaign Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g. Brand Awareness"
                        {...register("category")}
                        className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                      />
                      {errors.category && <p className="text-xs text-red-400">{errors.category.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Air Max Summer Activation"
                      {...register("title")}
                      className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                    />
                    {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="goal">Goal Objective</Label>
                    <Input
                      id="goal"
                      placeholder="e.g. Generate 10M+ impressions in EU"
                      {...register("goal")}
                      className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                    />
                    {errors.goal && <p className="text-xs text-red-400">{errors.goal.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="services">Services Rendered (comma separated)</Label>
                    <Input
                      id="services"
                      placeholder="e.g. Celebrity Booking, PR, Live Events"
                      {...register("services")}
                      className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                    />
                    {errors.services && <p className="text-xs text-red-400">{errors.services.message}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="impressions">Impressions Result</Label>
                      <Input
                        id="impressions"
                        placeholder="e.g. 15.2M"
                        {...register("impressions")}
                        className="bg-white/5 border-white/5 rounded-xl h-10 text-white font-mono"
                      />
                      {errors.impressions && <p className="text-xs text-red-400">{errors.impressions.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="engagement">Engagement Ratio</Label>
                      <Input
                        id="engagement"
                        placeholder="e.g. 8.5%"
                        {...register("engagement")}
                        className="bg-white/5 border-white/5 rounded-xl h-10 text-white font-mono"
                      />
                      {errors.engagement && <p className="text-xs text-red-400">{errors.engagement.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sales">Sales Lift</Label>
                      <Input
                        id="sales"
                        placeholder="e.g. +320%"
                        {...register("sales")}
                        className="bg-white/5 border-white/5 rounded-xl h-10 text-white font-mono"
                      />
                      {errors.sales && <p className="text-xs text-red-400">{errors.sales.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="image">Cover Showcase Image URL</Label>
                    <Input
                      id="image"
                      {...register("image")}
                      className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                    />
                    {errors.image && <p className="text-xs text-red-400">{errors.image.message}</p>}
                  </div>
                </form>
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddOpen(false);
                    setIsEditOpen(false);
                  }}
                  className="flex-1 rounded-xl border-white/10 hover:bg-white/5 h-11 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="portfolio-form"
                  disabled={isAdding || isUpdating}
                  className="flex-1 bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white font-semibold rounded-xl h-11"
                >
                  {isAddOpen ? "Publish Case Study" : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
