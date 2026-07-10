import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Instagram, Facebook, Mail, Phone, Wifi } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

export function MainLayout() {
  const location = useLocation();
  const [email, setEmail] = useState("");

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/influencers", label: "Influencers" },
    { path: "/events", label: "Events" },
    { path: "/portfolio", label: "Portfolio" },
    { path: "/contact", label: "Contact" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.85 },
      colors: ["#FF6A88", "#FF8E53", "#FFFFFF"],
    });
    toast.success("Welcome aboard!", {
      description: "You've successfully subscribed to Fosters Media newsletter.",
    });
    setEmail("");
  };

  const user = useAuthStore((s) => s.user);
  const userType = useAuthStore((s) => s.userType);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out", {
      description: "You have been signed out successfully."
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-white bg-mesh-grid">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#08090C]/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6A88] to-[#FF8E53] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="font-bold text-white text-lg">F</span>
              </div>
              <div className="text-xl font-bold tracking-tight">
                <span className="text-white group-hover:text-white/90 transition-colors">Fosters</span>
                <span className="text-gradient-accent"> Media</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-1 hover:text-[#FF6A88] ${
                    location.pathname === link.path ? "text-[#FF6A88]" : "text-white/70"
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] rounded-full" />
                  )}
                </Link>
              ))}

              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile">
                    <Button
                      variant="outline"
                      className="border-white/10 hover:bg-white/5 hover:border-white/20 rounded-full px-5 text-sm"
                    >
                      {user.name ? user.name.split(" ")[0] : "Profile"}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="text-white/80 hover:text-white rounded-full px-4 text-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 hover:border-white/20 rounded-full px-5 text-sm"
                  >
                    Login / Register
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24 bg-[#090A0E]/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6A88] to-[#FF8E53] flex items-center justify-center">
                  <span className="font-bold text-white text-md">F</span>
                </div>
                <div className="text-xl font-bold tracking-tight">
                  <span className="text-white">Fosters</span>
                  <span className="text-gradient-accent"> Media</span>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Premium Influencer marketing agency & Live Event management platform. Connecting world-class brands with visionary creators.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white tracking-wider text-sm uppercase mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {navLinks.slice(1).map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-white/50 hover:text-[#FF6A88] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white tracking-wider text-sm uppercase mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#FF6A88]" />
                  <span>partnerships@fostersmedia.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#FF6A88]" />
                  <span>+1 (555) 304-4500</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white tracking-wider text-sm uppercase mb-2">Subscribe</h4>
              <p className="text-xs text-white/50">Stay updated on our live collaborations & upcoming campaigns.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#FF6A88]/50 placeholder-white/30 text-white"
                />
                <Button type="submit" className="rounded-xl bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white hover:opacity-95 font-medium px-5">
                  Join
                </Button>
              </form>
              <div className="flex space-x-4 pt-2">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF6A88]/20 hover:text-[#FF6A88] transition-colors text-white/70"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF6A88]/20 hover:text-[#FF6A88] transition-colors text-white/70"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 text-center text-xs text-white/40">
            © 2026 Fosters Media Platform. Connected via Live Gateway. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

