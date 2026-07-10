import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { useEvents } from "../../../hooks/useEvents";
import { Event } from "../../../types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
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
import { Search, Plus, Edit, Trash2, MoreVertical, X, Calendar, MapPin, Users, Sparkles } from "lucide-react";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(3, "Location is required"),
  brands: z.string().min(1, "At least one brand name is required"),
  influencers: z.number().min(0, "Must be a positive number"),
  image: z.string().optional(),
  status: z.enum(["Registration Open", "VIP Access Only", "Planning Phase", "Completed"]),
  attendees: z.number().optional().default(0)
});

type EventFormFields = z.infer<typeof eventSchema>;

export function EventsManagement() {
  const { events, addEvent, updateEvent, deleteEvent, isAdding, isUpdating } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<EventFormFields>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      brands: "",
      influencers: 0,
      image: "",
      status: "Planning Phase",
      attendees: 0
    }
  });

  const openAddModal = () => {
    reset({
      title: "",
      date: new Date().toISOString().split("T")[0],
      location: "",
      brands: "",
      influencers: 0,
      image: "",
      status: "Planning Phase",
      attendees: 0
    });
    setIsAddOpen(true);
  };

  const openEditModal = (evt: Event) => {
    setEditingId(evt.id);
    reset({
      title: evt.title,
      date: evt.date,
      location: evt.location,
      brands: evt.brands.join(", "),
      influencers: evt.influencers,
      image: evt.image,
      status: evt.status,
      attendees: evt.attendees || 0
    });
    setIsEditOpen(true);
  };

  const handleAddSubmit = (data: EventFormFields) => {
    addEvent({
      title: data.title,
      date: data.date,
      location: data.location,
      brands: data.brands.split(",").map((s) => s.trim()).filter(Boolean),
      influencers: Number(data.influencers),
      image: data.image,
      status: data.status,
      attendees: Number(data.attendees),
      gallery: []
    });
    setIsAddOpen(false);
  };

  const handleEditSubmit = (data: EventFormFields) => {
    if (editingId === null) return;
    updateEvent({
      id: editingId,
      data: {
        title: data.title,
        date: data.date,
        location: data.location,
        brands: data.brands.split(",").map((s) => s.trim()).filter(Boolean),
        influencers: Number(data.influencers),
        image: data.image,
        status: data.status,
        attendees: Number(data.attendees)
      }
    });
    setIsEditOpen(false);
    setEditingId(null);
  };

  const handleDeleteClick = (id: number, title: string) => {
    if (confirm(`Are you sure you want to cancel and delete "${title}"?`)) {
      deleteEvent(id);
    }
  };

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.brands.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Events Management</h1>
          <p className="text-sm text-white/50">Plan and track promotional gala events, schedules, and attendees.</p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white rounded-xl h-10 px-5 font-semibold text-sm shadow-md shadow-primary/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Event
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by event title, city or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-white/5 border-white/5 rounded-full h-10 text-white placeholder-white/20 focus:border-[#FF6A88]/50"
          />
        </div>
        
        <div className="text-xs text-white/40 font-mono">
          Total Scheduled Events: {filtered.length}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel border-white/5 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-white/[0.02]">
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Event Title</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Date</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Location</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Brands</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Influencers</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px]">Status</TableHead>
              <TableHead className="text-white/60 font-semibold tracking-wider uppercase text-[10px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((evt) => (
              <TableRow key={evt.id} className="border-white/5 hover:bg-white/[0.015] transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                      <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-white text-sm">{evt.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white/70 text-xs font-mono">{evt.date}</TableCell>
                <TableCell className="text-white/50 text-xs">{evt.location}</TableCell>
                <TableCell className="text-xs">
                  <div className="flex flex-wrap gap-1">
                    {evt.brands.map((b) => (
                      <span key={b} className="px-2 py-0.5 rounded bg-white/5 text-white/70 font-mono text-[10px]">
                        {b}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-white/70 font-mono text-xs">{evt.influencers}</TableCell>
                <TableCell>
                  <Badge
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                      evt.status === "Completed"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : evt.status === "Registration Open"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : evt.status === "VIP Access Only"
                        ? "bg-[#FF6A88]/10 text-[#FF6A88] border border-[#FF6A88]/20"
                        : "bg-white/5 text-white/40 border border-white/10"
                    }`}
                  >
                    {evt.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-white/50 hover:text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-50 bg-[#0B0C10] border-white/10 text-white">
                      <DropdownMenuItem onClick={() => openEditModal(evt)} className="hover:bg-white/5 cursor-pointer">
                        <Edit className="w-4 h-4 mr-2 text-[#FF8E53]" />
                        Edit details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(evt.id, evt.title)} className="hover:bg-white/5 cursor-pointer text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-white/30 font-medium">
                  No events found in database schedule.
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
                    {isAddOpen ? "Schedule New Event" : "Edit Event Settings"}
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
                  id="event-form"
                  onSubmit={handleSubmit(isAddOpen ? handleAddSubmit : handleEditSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. VIP Fashion Gala"
                      {...register("title")}
                      className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                    />
                    {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="date">Event Date</Label>
                      <Input
                        id="date"
                        type="date"
                        {...register("date")}
                        className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                        style={{ colorScheme: "dark" }}
                      />
                      {errors.date && <p className="text-xs text-red-400">{errors.date.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="status">Current Status</Label>
                      <select
                        id="status"
                        {...register("status")}
                        className="w-full bg-white/5 border border-white/5 rounded-xl h-10 px-3 text-sm focus:outline-none focus:border-[#FF6A88]/50 text-white"
                      >
                        <option value="Planning Phase" className="bg-[#0E1015]">Planning Phase</option>
                        <option value="Registration Open" className="bg-[#0E1015]">Registration Open</option>
                        <option value="VIP Access Only" className="bg-[#0E1015]">VIP Access Only</option>
                        <option value="Completed" className="bg-[#0E1015]">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="influencers">Influencers Count</Label>
                      <Input
                        id="influencers"
                        type="number"
                        {...register("influencers", { valueAsNumber: true })}
                        className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                      />
                      {errors.influencers && <p className="text-xs text-red-400">{errors.influencers.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="attendees">Estimated Attendees</Label>
                      <Input
                        id="attendees"
                        type="number"
                        {...register("attendees", { valueAsNumber: true })}
                        className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                      />
                      {errors.attendees && <p className="text-xs text-red-400">{errors.attendees.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="location">Venue / Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. Gotham Hall, New York"
                      {...register("location")}
                      className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                    />
                    {errors.location && <p className="text-xs text-red-400">{errors.location.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="brands">Sponsoring Brands (comma separated)</Label>
                    <Input
                      id="brands"
                      placeholder="e.g. Apple, Sephora, Google"
                      {...register("brands")}
                      className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                    />
                    {errors.brands && <p className="text-xs text-red-400">{errors.brands.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="image">Cover Image URL</Label>
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
                  form="event-form"
                  disabled={isAdding || isUpdating}
                  className="flex-1 bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white font-semibold rounded-xl h-11"
                >
                  {isAddOpen ? "Schedule Event" : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
