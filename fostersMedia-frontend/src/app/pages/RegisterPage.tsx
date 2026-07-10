import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Lock, Mail, UserPlus, Loader2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(7, "Phone number must be at least 7 digits").optional(),
  accountType: z.enum(["user", "influencer", "brand"]).default("user"),
  instagramHandle: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().optional(),
  platforms: z.string().optional(),
});

type RegisterFields = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [accountType, setAccountType] = useState<"user" | "influencer" | "brand">("user");
  const { registerAsync, isRegistering } = useUserAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      accountType: "user",
      instagramHandle: "",
      category: "",
      location: "",
      bio: "",
      website: "",
      platforms: ""
    }
  });

  const onSubmit = async (data: RegisterFields) => {
    try {
      const platforms = data.platforms
        ? data.platforms.split(',').map((platform) => platform.trim()).filter(Boolean)
        : undefined;

      await registerAsync({
        ...data,
        platforms,
      });
      navigate("/login");
    } catch {
      // errors handled by toast
    }
  };

  return (
    <div className="min-h-screen bg-[#08090C] flex items-center justify-center relative overflow-hidden px-6 bg-mesh-grid text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-glow-radial rounded-full blur-[120px] opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6A88] to-[#FF8E53] items-center justify-center shadow-lg shadow-[#FF6A88]/20 mx-auto">
            <span className="font-extrabold text-white text-2xl">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Create your account</h1>
            <p className="text-xs text-white/50 uppercase tracking-widest font-mono font-medium mt-1">
              Register a user account for Fosters Media
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 border-white/5 shadow-2xl relative overflow-hidden bg-[#0E1015]/80 backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6A88]/5 rounded-full blur-2xl pointer-events-none" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  {...register("name")}
                  className={`pl-10 bg-white/5 border-white/5 rounded-xl h-11 placeholder-white/20 text-white focus:border-[#FF6A88]/50 ${
                    errors.name ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-400 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`pl-10 bg-white/5 border-white/5 rounded-xl h-11 placeholder-white/20 text-white focus:border-[#FF6A88]/50 ${
                    errors.email ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 555 123 4567"
                {...register("phone")}
                className="bg-white/5 border-white/5 rounded-xl h-11 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
              />
              {errors.phone && (
                <p className="text-xs text-red-400 font-medium">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="accountType">Account Type</Label>
              <select
                id="accountType"
                {...register("accountType")}
                onChange={(event) => setAccountType(event.target.value as "user" | "influencer" | "brand")}
                className="w-full bg-white/5 border border-white/10 rounded-xl h-11 px-4 text-white placeholder-white/40 focus:border-[#FF6A88]/50"
              >
                <option value="user">User</option>
                <option value="influencer">Influencer</option>
                <option value="brand">Brand</option>
              </select>
            </div>

            {accountType === "influencer" && (
              <div className="space-y-4 p-4 rounded-3xl border border-white/10 bg-white/5">
                <div className="text-sm font-semibold text-white/80">Influencer details</div>
                <div className="space-y-1.5">
                  <Label htmlFor="instagramHandle">Instagram Handle</Label>
                  <Input
                    id="instagramHandle"
                    type="text"
                    placeholder="@username"
                    {...register("instagramHandle")}
                    className="bg-white/5 border-white/5 rounded-xl h-11 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="Lifestyle, Travel, Beauty..."
                    {...register("category")}
                    className="bg-white/5 border-white/5 rounded-xl h-11 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Los Angeles, CA"
                    {...register("location")}
                    className="bg-white/5 border-white/5 rounded-xl h-11 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Short Bio</Label>
                  <Input
                    id="bio"
                    type="text"
                    placeholder="A short description of your creator niche"
                    {...register("bio")}
                    className="bg-white/5 border-white/5 rounded-xl h-11 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="platforms">Platforms</Label>
                  <Input
                    id="platforms"
                    type="text"
                    placeholder="Instagram, YouTube, TikTok"
                    {...register("platforms")}
                    className="bg-white/5 border-white/5 rounded-xl h-11 placeholder-white/20 text-white focus:border-[#FF6A88]/50"
                  />
                  <p className="text-[11px] text-white/50">Comma-separated handles or platform names.</p>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`pl-10 bg-white/5 border-white/5 rounded-xl h-11 placeholder-white/20 text-white focus:border-[#FF6A88]/50 ${
                    errors.password ? "border-red-500/50 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isRegistering}
              className="w-full bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white font-semibold rounded-xl h-11 shadow-lg shadow-[#FF6A88]/15 flex items-center justify-center space-x-2"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create account</span>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6 text-[10px] text-white/30 font-mono space-y-2">
          <div>Already registered?</div>
          <Link to="/login" className="text-[#FF6A88] hover:underline">
            Sign in instead
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
