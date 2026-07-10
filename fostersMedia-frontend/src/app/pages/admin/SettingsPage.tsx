import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { useSettings } from "../../../hooks/useSettings";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Sparkles, Loader2, Save, Globe, MessageSquare } from "lucide-react";

const settingsSchema = z.object({
  heroTitle: z.string().min(3, "Hero title must be at least 3 characters"),
  heroSubtitle: z.string().min(3, "Hero subtitle must be at least 3 characters"),
  logoText: z.string().min(2, "Logo text must be at least 2 characters"),
  email: z.string().email("Please enter a valid business email"),
  phone: z.string().min(6, "Phone number is required"),
  instagramUrl: z.string().url("Must be a valid Instagram URL"),
  facebookUrl: z.string().url("Must be a valid Facebook URL"),
  footerText: z.string().min(10, "Footer description must be at least 10 characters")
});

type SettingsFields = z.infer<typeof settingsSchema>;

export function SettingsPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SettingsFields>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings
  });

  // Reset form once settings load from query provider
  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = (data: SettingsFields) => {
    updateSettings(data);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6A88]" />
        <p className="text-sm text-white/50">Fetching operational layout nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Website Settings</h1>
          <p className="text-sm text-white/50">Edit site-wide copywriting, branding logo, and media anchors in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Branding Settings Panel */}
            <div className="glass-panel p-6 border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white tracking-wide border-b border-white/5 pb-2 flex items-center">
                <Globe className="w-4.5 h-4.5 mr-2 text-[#FF6A88]" />
                Identity & Branding
              </h3>
              
              <div className="space-y-1.5">
                <Label htmlFor="logoText">Logo Brand Name</Label>
                <Input
                  id="logoText"
                  placeholder="e.g. Fosters Media"
                  {...register("logoText")}
                  className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                />
                {errors.logoText && <p className="text-xs text-red-400">{errors.logoText.message}</p>}
              </div>
            </div>

            {/* Landing Copy Settings Panel */}
            <div className="glass-panel p-6 border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white tracking-wide border-b border-white/5 pb-2 flex items-center">
                <Sparkles className="w-4.5 h-4.5 mr-2 text-[#FF8E53]" />
                Landing Hero Copy
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="heroTitle">Hero Core Title</Label>
                  <Input
                    id="heroTitle"
                    placeholder="e.g. Connecting Brands"
                    {...register("heroTitle")}
                    className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                  />
                  {errors.heroTitle && <p className="text-xs text-red-400">{errors.heroTitle.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    placeholder="e.g. With Visionaries"
                    {...register("heroSubtitle")}
                    className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                  />
                  {errors.heroSubtitle && <p className="text-xs text-red-400">{errors.heroSubtitle.message}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information Settings Panel */}
            <div className="glass-panel p-6 border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white tracking-wide border-b border-white/5 pb-2 flex items-center">
                <MessageSquare className="w-4.5 h-4.5 mr-2 text-[#FF6A88]" />
                Contact Coordinates
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    placeholder="partnerships@company.com"
                    {...register("email")}
                    className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                  />
                  {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Hotline</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    {...register("phone")}
                    className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                  />
                  {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Social Anchors Settings Panel */}
            <div className="glass-panel p-6 border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white tracking-wide border-b border-white/5 pb-2">
                Social Media Coordinates
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="instagramUrl">Instagram Channel URL</Label>
                  <Input
                    id="instagramUrl"
                    {...register("instagramUrl")}
                    className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                  />
                  {errors.instagramUrl && <p className="text-xs text-red-400">{errors.instagramUrl.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="facebookUrl">Facebook Page URL</Label>
                  <Input
                    id="facebookUrl"
                    {...register("facebookUrl")}
                    className="bg-white/5 border-white/5 rounded-xl h-10 text-white"
                  />
                  {errors.facebookUrl && <p className="text-xs text-red-400">{errors.facebookUrl.message}</p>}
                </div>
              </div>
            </div>

            {/* Footer Settings Panel */}
            <div className="glass-panel p-6 border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white tracking-wide border-b border-white/5 pb-2">
                Footer Copyright & Description
              </h3>
              
              <div className="space-y-1.5">
                <Label htmlFor="footerText">Footer Copyright Text</Label>
                <Textarea
                  id="footerText"
                  placeholder="Copyright text and corporate description..."
                  {...register("footerText")}
                  className="bg-white/5 border-white/5 rounded-xl min-h-[90px] text-white"
                />
                {errors.footerText && <p className="text-xs text-red-400">{errors.footerText.message}</p>}
              </div>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white font-semibold rounded-xl h-11 flex items-center justify-center space-x-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deploying configuration...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Deploy Configuration</span>
                </>
              )}
            </Button>

          </form>
        </div>

        {/* Live Preview Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="glass-panel p-6 border-white/5 space-y-4">
            <h4 className="font-bold text-sm text-white border-b border-white/5 pb-2">Live Gateway Synchronization</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Updating these parameters instantly synchronizes the layout properties across the client pages in real-time. Try changing the brand name or hero subtitle to see the active UI update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
