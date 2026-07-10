import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { useTestimonials } from "../../../hooks/useTestimonials";
import { Testimonial } from "../../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Search, Plus, Edit, Trash2, MoreVertical, X, Star, Sparkles } from "lucide-react";

const schema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  company:    z.string().min(2, "Company name is required"),
  review:     z.string().min(10, "Review must be at least 10 characters"),
  rating:     z.number().min(1).max(5),
});
type Fields = z.infer<typeof schema>;

export function TestimonialManagement() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial, isAdding, isUpdating } = useTestimonials();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen]     = useState(false);
  const [isEditOpen, setIsEditOpen]   = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: { clientName: "", company: "", review: "", rating: 5 },
  });

  const openAdd = () => { reset({ clientName: "", company: "", review: "", rating: 5 }); setIsAddOpen(true); };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    reset({ clientName: t.clientName, company: t.company, review: t.review, rating: t.rating });
    setIsEditOpen(true);
  };

  const handleAddSubmit = (data: Fields) => { addTestimonial(data); setIsAddOpen(false); };

  const handleEditSubmit = (data: Fields) => {
    if (!editingId) return;
    updateTestimonial({ id: editingId, data });
    setIsEditOpen(false); setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete testimonial by "${name}"?`)) deleteTestimonial(id);
  };

  const filtered = testimonials.filter((t) =>
    t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.review.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closePanel = () => { setIsAddOpen(false); setIsEditOpen(false); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Testimonials</h1>
          <p className="text-sm text-white/50">Manage client feedback reviews for public display.</p>
        </div>
        <Button onClick={openAdd} className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white rounded-xl h-10 px-5 font-semibold text-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Review
        </Button>
      </div>

      <div className="glass-panel p-4 border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 w-4 h-4" />
          <Input type="text" placeholder="Search reviews..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-white/5 border-white/5 rounded-full h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50" />
        </div>
        <div className="text-xs text-white/40 font-mono">Count: {filtered.length}</div>
      </div>

      <div className="glass-panel border-white/5 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-white/[0.02]">
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Client</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Company</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Rating</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Review</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id} className="border-white/5 hover:bg-white/[0.015] transition-colors">
                <TableCell className="py-4 font-bold text-white text-sm">{t.clientName}</TableCell>
                <TableCell className="text-white/70 text-xs">{t.company}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-0.5 text-yellow-400">
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />)}
                  </div>
                </TableCell>
                <TableCell className="text-white/60 text-xs max-w-xs truncate">{t.review}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-white/50 hover:text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-50 bg-[#0B0C10] border-white/10 text-white">
                      <DropdownMenuItem onClick={() => openEdit(t)} className="hover:bg-white/5 cursor-pointer">
                        <Edit className="w-4 h-4 mr-2 text-[#FF8E53]" /> Edit review
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(t.id, t.clientName)} className="hover:bg-white/5 cursor-pointer text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-white/30 font-medium">No reviews found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AnimatePresence>
        {(isAddOpen || isEditOpen) && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg h-full bg-[#0E1015] border-l border-white/10 p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-2xl font-bold tracking-tight text-white flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-[#FF6A88]" />
                    {isAddOpen ? "Add Review" : "Edit Review"}
                  </h3>
                  <button onClick={closePanel} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form id="testimonial-form" onSubmit={handleSubmit(isAddOpen ? handleAddSubmit : handleEditSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" placeholder="e.g. Jessica Alba" {...register("clientName")} className="bg-white/5 border-white/5 rounded-xl h-10 text-white" />
                    {errors.clientName && <p className="text-xs text-red-400">{errors.clientName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="e.g. Nike Inc." {...register("company")} className="bg-white/5 border-white/5 rounded-xl h-10 text-white" />
                    {errors.company && <p className="text-xs text-red-400">{errors.company.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rating">Rating (1–5 Stars)</Label>
                    <select id="rating" {...register("rating", { valueAsNumber: true })}
                      className="w-full bg-white/5 border border-white/5 rounded-xl h-10 px-3 text-sm focus:outline-none focus:border-[#FF6A88]/50 text-white font-mono">
                      {[5,4,3,2,1].map(n => <option key={n} value={n} className="bg-[#0E1015]">{n} Star{n > 1 ? "s" : ""}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="review">Review</Label>
                    <Textarea id="review" placeholder="Write the client feedback here..." {...register("review")} className="bg-white/5 border-white/5 rounded-xl min-h-[100px] text-white" />
                    {errors.review && <p className="text-xs text-red-400">{errors.review.message}</p>}
                  </div>
                </form>
              </div>
              <div className="flex gap-3 pt-6 border-t border-white/5">
                <Button type="button" variant="outline" onClick={closePanel} className="flex-1 rounded-xl border-white/10 hover:bg-white/5 h-11 text-white">Cancel</Button>
                <Button type="submit" form="testimonial-form" disabled={isAdding || isUpdating}
                  className="flex-1 bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white font-semibold rounded-xl h-11">
                  {isAddOpen ? "Add Review" : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
