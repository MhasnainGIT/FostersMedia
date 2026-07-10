import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  Briefcase,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  Star
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuthStore } from "../../store/authStore";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const mainNavItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/influencers", icon: Users, label: "Influencers" },
    { path: "/admin/enquiries", icon: Mail, label: "Enquiries" },
  ];

  const opsNavItems = [
    { path: "/admin/events", icon: Calendar, label: "Events" },
    { path: "/admin/brands", icon: Building2, label: "Brand Partners" },
    { path: "/admin/portfolio", icon: Briefcase, label: "Case Studies" },
    { path: "/admin/testimonials", icon: Star, label: "Testimonials" },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/admin/login");
  };

  const NavLink = ({ path, icon: Icon, label }: { path: string; icon: React.ElementType; label: string }) => (
    <Link to={path}>
      <button
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
          isActive(path)
            ? "bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white shadow-lg shadow-[#FF6A88]/10"
            : "text-white/60 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{label}</span>
      </button>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#08090C] text-white flex bg-mesh-grid">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#090A0E] p-6 flex flex-col justify-between fixed h-screen z-20">
        <div className="space-y-8">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6A88] to-[#FF8E53] flex items-center justify-center shadow-lg">
              <span className="font-bold text-white text-lg">F</span>
            </div>
            <div className="text-xl font-bold tracking-tight">
              <span className="text-white">Fosters</span>
              <span className="text-gradient-accent"> Control</span>
            </div>
          </Link>

          <nav className="space-y-1">
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block mb-2 px-3">Main Console</span>
            {mainNavItems.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}

            <div className="pt-4 border-t border-white/5 mt-4 space-y-1">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block mb-2 px-3">Live Operations</span>
              {opsNavItems.map((item) => (
                <NavLink key={item.path} {...item} />
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 mt-4 space-y-1">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest block mb-2 px-3">Configuration</span>
              <NavLink path="/admin/settings" icon={Settings} label="Settings" />
            </div>
          </nav>
        </div>

        {/* Sidebar Footer node */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          {/* Live Node indicators */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white/40 uppercase tracking-wider font-semibold">Live Gateway</span>
              <span className="text-emerald-400 font-mono flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 pulse-success"></span>
                ACTIVE
              </span>
            </div>
            <div className="text-[9px] text-white/30 font-mono leading-none truncate">
              wss://api.fostersmedia.live
            </div>
          </div>

          <Button variant="outline" onClick={handleLogout} className="w-full border-white/10 hover:bg-white/5 text-sm rounded-xl h-10">
            <LogOut className="w-4 h-4 mr-2" />
            Exit Console
          </Button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 pl-64 overflow-auto min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

