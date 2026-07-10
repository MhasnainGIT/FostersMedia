import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";
import { useData } from "../context/DataContext";
import {
  Users,
  Calendar,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  DollarSign
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function LandingPage() {
  const { influencers } = useData();

  const activeInfluencerCount = influencers.filter(i => i.status === "Active").length;

  const features = [
    {
      icon: Users,
      title: "Creator Selection",
      description: "Connect with vetted influencers matching your brand's unique demographics and voice.",
    },
    {
      icon: Calendar,
      title: "Immersive Events",
      description: "Design and execute high-profile brand activations, VIP previews, and media launches.",
    },
    {
      icon: TrendingUp,
      title: "Analytics Hub",
      description: "Access real-time impressions, engagement ratios, and granular conversion reporting.",
    },
  ];

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="relative overflow-hidden pb-20">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-glow-radial rounded-full blur-[100px] opacity-60" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-glow-radial rounded-full blur-[100px] opacity-40" />
      </div>

      
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 md:py-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#FF6A88]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-white/80">Next-Gen Media Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none text-gradient-rose">
              Connecting Brands <br />
              <span className="text-gradient-accent">With Visionaries</span>
            </h1>

            <p className="text-lg text-white/70 max-w-xl leading-relaxed">
              We streamline premium collaborations between world-class brands and verified content creators. Run campaigns and events powered by real-time analytics.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/influencers">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-primary/20"
                >
                  Hire an Influencer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 hover:bg-white/5 hover:border-white/20 rounded-full px-8 py-6 text-base font-semibold"
                >
                  Book an Event
                </Button>
              </Link>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="glass-panel p-6 border-white/10 shadow-2xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6A88]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-3">
                  <img
                    src="/logo-fostersmedia.png"
                    alt="Fosters Media"
                    className="h-6 w-auto object-contain"
                    loading="eager"
                  />
                  Featured Creators
                </h3>
                <p className="text-sm text-white/60">Explore top talent and campaign-ready influencers handpicked for your brand.</p>
              </div>

              <div className="w-full flex items-center justify-center">
                <img
                  src="/logo-fostersmedia.png"
                  alt="Fosters Media"
                  className="w-40 h-auto object-contain"
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Why Partner With <span className="text-gradient-accent">Fosters Media</span>
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            We provide full-service campaign execution, connecting premium brand requirements with top tier influencer matching.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="glass-panel glass-panel-hover p-8 border-white/5 space-y-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6A88]/20 to-[#FF8E53]/10 flex items-center justify-center">
                <feat.icon className="w-5 h-5 text-[#FF6A88]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-wide">{feat.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="glass-panel border-white/5 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-[#090A0E]/20">
          <div className="space-y-1">
            <div className="text-4xl font-extrabold text-gradient-accent font-mono">{activeInfluencerCount}+</div>
            <div className="text-xs font-medium text-white/50 uppercase tracking-wider">Active Creators</div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-extrabold text-gradient-accent font-mono">1.2K+</div>
            <div className="text-xs font-medium text-white/50 uppercase tracking-wider">Campaigns Run</div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-extrabold text-gradient-accent font-mono">350+</div>
            <div className="text-xs font-medium text-white/50 uppercase tracking-wider">Events Orchestrated</div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-extrabold text-gradient-accent font-mono">200+</div>
            <div className="text-xs font-medium text-white/50 uppercase tracking-wider">Global Brands</div>
          </div>
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-[#FF6A88]/10 to-[#FF8E53]/5 border border-[#FF6A88]/20 rounded-3xl p-12 md:p-16 overflow-hidden text-center space-y-6"
        >
          <div className="absolute inset-0 bg-mesh-grid opacity-30" />
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-gradient-rose tracking-tight">
            Ready to Elevate Your Brand Presence?
          </h2>
          <p className="text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            Collaborate with leading influencers and run custom campaigns built to deliver verified engagement metrics.
          </p>

          <div className="pt-2">
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] hover:opacity-95 text-white rounded-full px-10 py-6 text-base font-semibold shadow-lg shadow-primary/10"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
      
    </div>
  );
}
