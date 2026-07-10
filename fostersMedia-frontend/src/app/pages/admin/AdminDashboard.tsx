import { motion } from "motion/react";
import { Link } from "react-router";
import {
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Bell,
  Search,
  Menu,
  LayoutDashboard,
  Target,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  Star,
  Clock,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { useDashboard } from "../../hooks/useDashboard";
import { useEnquiries } from "../../hooks/useEnquiries";
import { usePortfolio } from "../../hooks/usePortfolio";
import { useData } from "../context/DataContext";

export function AdminDashboard() {
  const { stats, revenueTimeline } = useDashboard();
  const { enquiries } = useEnquiries();
  const { portfolio } = usePortfolio();
  const { campaigns } = useData();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin", active: true },
    { icon: Users, label: "Influencers", path: "/admin/influencers" },
    { icon: Calendar, label: "Events", path: "/admin/events" },
    { icon: Target, label: "Campaigns", path: "/admin/campaigns" },
    { icon: Briefcase, label: "Brands", path: "/admin/brands" },
    { icon: Star, label: "Portfolio", path: "/admin/portfolio" },
    { icon: ImageIcon, label: "Gallery", path: "/admin/gallery" },
    { icon: MessageSquare, label: "Testimonials", path: "/admin/testimonials" },
    { icon: MessageSquare, label: "Enquiries", path: "/admin/enquiries" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const statsCards = [
    { label: "Total Influencers", value: String(stats?.totalInfluencers ?? 0), change: "+0%", icon: Users, color: "text-blue-400" },
    { label: "Total Brands", value: String(stats?.totalBrands ?? 0), change: "+0%", icon: Briefcase, color: "text-purple-400" },
    { label: "Campaigns Running", value: String(stats?.totalCampaigns ?? campaigns.length), change: "+0%", icon: Target, color: "text-green-400" },
    { label: "Upcoming Events", value: String(stats?.upcomingEvents ?? 0), change: "+0%", icon: Calendar, color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0F1115] fixed h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D66A4A] to-[#B8563C] flex items-center justify-center">
              <span className="font-bold text-xl">F</span>
            </div>
            <div>
              <div className="font-bold">Fosters Media</div>
              <div className="text-xs text-white/60">Admin Panel</div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  item.active
                    ? "bg-[#D66A4A] text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}

            <button className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors w-full mt-8">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0F1115]/80 backdrop-blur-xl">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-white/5 border-white/10 focus:border-[#D66A4A]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D66A4A] rounded-full" />
              </Button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D66A4A] to-[#B8563C] flex items-center justify-center">
                <span className="font-semibold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Welcome Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-white/60">Here's what's happening with your platform today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Revenue Overview</h3>
                  <p className="text-sm text-white/60">Monthly revenue in ₹</p>
                </div>
                <Button variant="ghost" size="sm" className="text-[#D66A4A]">
                  View All
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revenueTimeline ?? []}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D66A4A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D66A4A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 17, 21, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D66A4A"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Campaigns Chart */}
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Campaigns Overview</h3>
                  <p className="text-sm text-white/60">Monthly campaigns</p>
                </div>
                <Button variant="ghost" size="sm" className="text-[#D66A4A]">
                  View All
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 17, 21, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="campaigns" fill="#D66A4A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Enquiries */}
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Recent Enquiries</h3>
                <Link to="/admin/enquiries">
                  <Button variant="ghost" size="sm" className="text-[#D66A4A]">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {enquiries && enquiries.length > 0 ? enquiries.slice(0, 4).map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{enquiry.company}</div>
                      <div className="text-sm text-white/60">{enquiry.type} • {enquiry.budget}</div>
                    </div>
                    <Badge
                      className={`${
                        enquiry.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : enquiry.status === "contacted"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {enquiry.status}
                    </Badge>
                  </div>
                )) : (
                  <div className="text-sm text-white/40">No enquiries available</div>
                )}
              </div>
            </Card>

            {/* Latest Campaigns */}
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Latest Campaigns</h3>
                <Button variant="ghost" size="sm" className="text-[#D66A4A]">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {campaigns && campaigns.length > 0 ? campaigns.slice(0, 4).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{campaign.name}</div>
                        <div className="text-sm text-white/60">{campaign.client}</div>
                      </div>
                      <Badge
                        className={`${
                          campaign.status === "active"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Progress</span>
                        <span className="font-semibold">{campaign.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D66A4A] rounded-full transition-all"
                          style={{ width: `${campaign.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-white/40">No campaigns available</div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6 bg-white/5 border-white/10">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Add Influencer", icon: Users, path: "/admin/influencers" },
                { label: "Create Campaign", icon: Target },
                { label: "Schedule Event", icon: Calendar },
                { label: "View Reports", icon: TrendingUp },
              ].map((action) => (
                <Button
                  key={action.label}
                  className="h-24 flex-col space-y-2 bg-white/5 hover:bg-white/10 border border-white/10"
                  asChild
                >
                  <Link to={action.path || "#"}>
                    <action.icon className="w-6 h-6" />
                    <span>{action.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
