import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { useBrands } from "../../../hooks/useBrands";
import { Brand } from "../../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Search, Plus, Edit, Trash2, MoreVertical, X, Mail, Phone, Sparkles } from "lucide-react";

const schema = z.object({
  companyName:   z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email:         z.string().email("Must be a valid email"),
  phone:         z.string().optional().default(""),
  industry:      z.string().optional().default(""),
  website:       z.string().optional().default(""),
  address:       z.string().optional().default(""),
  notes:         z.string().optional().default(""),
});
type Fields = z.infer<typeof schema>;

export function BrandManagement() {
  const { brands, addBrand, updateBrand, deleteBrand, isAdding, isUpdating } = useBrands();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen]     = useState(false);
  const [isEditOpen, setIsEditOpen]   = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: { companyName: "", contactPerson: "", email: "", phone: "", industry: "", website: "", address: "", notes: "" },
  });

  const openAdd = () => {
    reset({ companyName: "", contactPerson: "", email: "", phone: "", industry: "", website: "", address: "", notes: "" });
    setIsAddOpen(true);
  };

  const openEdit = (b: Brand) => {
    setEditingId(b.id);
    reset({ companyName: b.companyName, contactPerson: b.contactPerson, email: b.email, phone: b.phone || "", industry: b.industry || "", website: b.website || "", address: b.address || "", notes: b.notes || "" });
    setIsEditOpen(true);
  };

  const handleAddSubmit = (data: Fields) => { addBrand(data); setIsAddOpen(false); };

  const handleEditSubmit = (data: Fields) => {
    if (!editingId) return;
    updateBrand({ id: editingId, data });
    setIsEditOpen(false); setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete brand "${name}"?`)) deleteBrand(id);
  };

  const filtered = brands.filter((b) =>
    b.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.industry || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closePanel = () => { setIsAddOpen(false); setIsEditOpen(false); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Brand Partners</h1>
          <p className="text-sm text-white/50">Manage corporate relations, partnerships, and campaign contracts.</p>
        </div>
        <Button onClick={openAdd} className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white rounded-xl h-10 px-5 font-semibold text-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Partner
        </Button>
      </div>

      <div className="glass-panel p-4 border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 w-4 h-4" />
          <Input type="text" placeholder="Search by company, rep, or industry..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-white/5 border-white/5 rounded-full h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50" />
        </div>
        <div className="text-xs text-white/40 font-mono">Total Partners: {filtered.length}</div>
      </div>

      <div className="glass-panel border-white/5 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-white/[0.02]">
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Brand Company</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Representative</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Contact Info</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Industry</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Website</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => (
              <TableRow key={b.id} className="border-white/5 hover:bg-white/[0.015] transition-colors">
                <TableCell className="py-4 font-bold text-white text-sm">{b.companyName}</TableCell>
                <TableCell className="text-white/70 text-xs">{b.contactPerson}</TableCell>
                <TableCell className="text-xs text-white/50 space-y-0.5">
                  <div className="flex items-center space-x-1.5 font-mono"><Mail className="w-3 h-3 text-[#FF6A88]" /><span>{b.email}</span></div>
                  {b.phone && <div className="flex items-center space-x-1.5 font-mono"><Phone className="w-3 h-3 text-[#FF8E53]" /><span>{b.phone}</span></div>}
                </TableCell>
                <TableCell className="text-white/60 text-xs">{b.industry || "—"}</TableCell>
                <TableCell className="text-white/50 text-xs truncate max-w-[140px]">{b.website || "—"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-white/50 hover:text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-50 bg-[#0B0C10] border-white/10 text-white">
                      <DropdownMenuItem onClick={() => openEdit(b)} className="hover:bg-white/5 cursor-pointer">
                        <Edit className="w-4 h-4 mr-2 text-[#FF8E53]" /> Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(b.id, b.companyName)} className="hover:bg-white/5 cursor-pointer text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Partner
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-white/30 font-medium">No brand partners found.</TableCell>
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
                    {isAddOpen ? "Add Corporate Partner" : "Edit Partner Profile"}
                  </h3>
                  <button onClick={closePanel} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form id="brand-form" onSubmit={handleSubmit(isAddOpen ? handleAddSubmit : handleEditSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" placeholder="e.g. Google LLC" {...register("companyName")} className="bg-white/5 border-white/5 rounded-xl h-10 text-white" />
                      {errors.companyName && <p className="text-xs text-red-400">{errors.companyName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input id="contactPerson" placeholder="e.g. Sundar Pichai" {...register("contactPerson")} className="bg-white/5 border-white/5 rounded-xl h-10 text-white" />
                      {errors.contactPerson && <p className="text-xs text-red-400">{errors.contactPerson.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Business Email</Label>
                      <Input id="email" placeholder="name@company.com" {...register("email")} className="bg-white/5 border-white/5 rounded-xl h-10 text-white" />
                      {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="+1 (555) 123-4567" {...register("phone")} className="bg-white/5 border-white/5 rounded-xl h-10 text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="industry">Industry</Label>
                      <Input id="industry" placeholder="e.g. Technology" {...register("industry")} className="bg-white/5 border-white/5 rounded-xl h-10 text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" placeholder="https://company.com" {...register("website")} className="bg-white/5 border-white/5 rounded-xl h-10 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St, City" {...register("address")} className="bg-white/5 border-white/5 rounded-xl h-10 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Brief details about current engagements..." {...register("notes")} className="bg-white/5 border-white/5 rounded-xl min-h-[90px] text-white" />
                  </div>
                </form>
              </div>
              <div className="flex gap-3 pt-6 border-t border-white/5">
                <Button type="button" variant="outline" onClick={closePanel} className="flex-1 rounded-xl border-white/10 hover:bg-white/5 h-11 text-white">Cancel</Button>
                <Button type="submit" form="brand-form" disabled={isAdding || isUpdating}
                  className="flex-1 bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white font-semibold rounded-xl h-11">
                  {isAddOpen ? "Register Brand" : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
