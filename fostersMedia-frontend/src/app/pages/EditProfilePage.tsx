import { Navigate } from "react-router";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { ImagePlus, Upload } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().optional(),
  accountType: z.enum(["user", "influencer", "brand"]),
  instagramHandle: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
});

type ProfileFields = z.infer<typeof profileSchema>;

export function EditProfilePage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState<"user" | "influencer" | "brand">(
    (user?.accountType as "user" | "influencer" | "brand") ?? "user"
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    () => localStorage.getItem("fm_auth_user") ? (JSON.parse(localStorage.getItem("fm_auth_user")!).avatar || "") : ""
  );
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyFile = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) applyFile(file);
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone || "",
      accountType: user.accountType || "user",
      instagramHandle: user.profile?.instagramHandle || "",
      category: user.profile?.category || "",
      location: user.profile?.location || "",
      bio: user.profile?.bio || "",
      website: user.profile?.website || ""
    }
  });

  const onSubmit = async (data: ProfileFields) => {
    try {
      const storedUser = localStorage.getItem("fm_auth_user");
      if (!storedUser) throw new Error("No authenticated user found.");

      const currentUser = JSON.parse(storedUser);

      let avatar = currentUser.avatar || "";
      if (imageFile) {
        avatar = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      const updatedUser = {
        ...currentUser,
        name: data.name,
        phone: data.phone,
        accountType: data.accountType,
        avatar,
        profile: {
          instagramHandle: data.instagramHandle,
          category: data.category,
          location: data.location,
          bio: data.bio,
          website: data.website,
          platforms: currentUser.profile?.platforms || []
        }
      };

      localStorage.setItem("fm_auth_user", JSON.stringify(updatedUser));
      useAuthStore.getState().setAuth(useAuthStore.getState().token || "", updatedUser, data.accountType);

      toast.success("Profile saved", { description: "Your profile information was updated." });
      navigate("/profile");
    } catch (error) {
      toast.error("Save failed", { description: error instanceof Error ? error.message : "Unable to save profile." });
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-6 py-16 bg-[#08090C] text-white bg-mesh-grid">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#FF6A88]/80">Edit Profile</p>
          <h1 className="mt-3 text-3xl font-bold">Update your account details</h1>
          <p className="mt-2 text-sm text-white/60">Save your information and influencer profile data.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-[#FF6A88]/10">

          {/* Profile Photo */}
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-colors h-36
                ${dragOver ? "border-[#FF6A88] bg-[#FF6A88]/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
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
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) applyFile(f); }} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" {...register("name")} className="bg-white/5 border-white/10 rounded-xl h-11 px-4 text-white" />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...register("phone")} className="bg-white/5 border-white/10 rounded-xl h-11 px-4 text-white" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="accountType">Account Type</Label>
            <select id="accountType" {...register("accountType")} value={accountType} onChange={(e) => setAccountType(e.target.value as "user" | "influencer" | "brand")} className="w-full bg-white/5 border-white/10 rounded-xl h-11 px-4 text-white">
              <option value="user">User</option>
              <option value="influencer">Influencer</option>
              <option value="brand">Brand</option>
            </select>
          </div>

          {accountType === "influencer" && (
            <div className="space-y-4 p-4 rounded-3xl border border-white/10 bg-white/5">
              <div className="space-y-1.5">
                <Label htmlFor="instagramHandle">Instagram Handle</Label>
                <Input id="instagramHandle" type="text" {...register("instagramHandle")} className="bg-white/5 border-white/10 rounded-xl h-11 px-4 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input id="category" type="text" {...register("category")} className="bg-white/5 border-white/10 rounded-xl h-11 px-4 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" type="text" {...register("location")} className="bg-white/5 border-white/10 rounded-xl h-11 px-4 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" type="text" {...register("bio")} className="bg-white/5 border-white/10 rounded-xl h-11 px-4 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" {...register("website")} className="bg-white/5 border-white/10 rounded-xl h-11 px-4 text-white" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Button type="submit" className="rounded-full bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] px-6 py-3 text-white">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
