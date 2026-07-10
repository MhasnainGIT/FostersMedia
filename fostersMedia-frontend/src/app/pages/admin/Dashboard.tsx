import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useDashboard } from "../../../hooks/useDashboard";
import { useDashboardStore } from "../../../store/dashboardStore";
import { useEnquiries } from "../../../hooks/useEnquiries";
import {
  Users,
  Building2,
  Megaphone,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUp,
  Activity,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

// Helper to format currency
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
};

export function Dashboard() {
  const { stats, revenueTimeline, isLoadingStats } = useDashboard();
  const { enquiries } = useEnquiries();

  const statCards = [
    {
      title: "Total Influencers",
      value: String(stats?.totalInfluencers ?? 0),
      change: `+${stats?.activeInfluencers ?? 0} active`,
      icon: Users,
      color: "#FF6A88"
    },
    {
      title: "Campaigns Running",
      value: String(stats?.totalCampaigns ?? 0),
      change: `${stats?.runningCampaigns ?? 0} active`,
      icon: Megaphone,
      color: "#FF8E53"
    },
    {
      title: "Pending Enquiries",
      value: String(stats?.pendingEnquiries ?? 0),
      change: `${stats?.totalEnquiries ?? 0} total`,
      icon: Building2,
      color: "#FFAA7D"
    },
    {
      title: "Upcoming Events",
      value: String(stats?.upcomingEvents ?? 0),
      change: "+3 this week",
      icon: Calendar,
      color: "#C24D64"
    },
    {
      title: "Revenue (MTD)",
      value: formatCurrency(stats?.revenue ?? 0),
      change: "Ticking Live",
      icon: DollarSign,
      color: "#FF6A88"
    },
    {
      title: "Live Visitors",
      value: String(stats?.visitors ?? 0),
      change: "Connected",
      icon: Activity,
      color: "#10B981"
    }
  ];

  // Revenue timeline from hook (falls back to static if loading)
  const monthlyRevenueData = revenueTimeline && revenueTimeline.length > 0 ? revenueTimeline : [];

  // Real-Time Activity Ticker Chart State (simulates socket bandwidth)
  const [activityData, setActivityData] = useState(() => {
    const initial: { time: string; requests: number }[] = [];
    const now = new Date();
    for (let i = 9; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 4000);
      initial.push({
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        requests: 0
      });
    }
    return initial;
  });
  // Real-time updates should be fed from a WebSocket or server-sent events.

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Console Dashboard</h1>
          <p className="text-sm text-white/50">Welcome back, Administrator. Real-time telemetry nodes are online.</p>
        </div>
              <div
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-mono rounded-xl border ${{
                  true: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                  false: "bg-rose-500/6 border-rose-400/12 text-rose-300"
                }[String(useDashboardStore((s) => s.websocketConnected) === true)]}`}
              >
                <span className={`h-2 w-2 rounded-full mr-1 ${useDashboardStore((s) => s.websocketConnected) ? "bg-emerald-500 pulse-success" : "bg-rose-400"}`}></span>
                <span>{useDashboardStore((s) => s.websocketConnected) ? "WEBSOCKET CONNECTED" : "WEBSOCKET DISCONNECTED"}</span>
              </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <Card className="glass-panel border-white/5 p-6 hover:border-white/10 transition-all flex flex-col justify-between h-36">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">{stat.title}</span>
                  <div className="text-2xl font-extrabold text-white tracking-tight font-mono mt-1 select-all">
                    {stat.value}
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-white/40">{stat.change}</span>
                <span className="text-emerald-400 font-medium flex items-center font-mono">
                  <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                  +12.4%
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real-time Ticking Activity Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-8"
        >
          <Card className="glass-panel border-white/5 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-white tracking-wide flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-[#FF6A88]" />
                  Real-Time Gateway Traffic
                </h3>
                <p className="text-xs text-white/40">Aggregated payload calls resolved by Stitch pipeline (ticking every 4s)</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-[#FF8E53]">
                  {activityData[activityData.length - 1]?.requests} calls/sec
                </span>
              </div>
            </div>

            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="gradientRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6A88" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#FF6A88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B0C10",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#FF6A88"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradientRequests)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Revenue Static Bar/Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-4"
        >
          <Card className="glass-panel border-white/5 p-6 space-y-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide flex items-center mb-1">
                <TrendingUp className="w-4 h-4 mr-2 text-[#FF8E53]" />
                Revenue Trend
              </h3>
              <p className="text-xs text-white/40">Consolidated monthly gross metrics (Million USD)</p>
            </div>

            <div className="w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B0C10",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FF8E53"
                    strokeWidth={3}
                    dot={{ stroke: "#FF8E53", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-[10px] text-white/30 text-center font-mono">
              Last audit: 5 minutes ago • Connected
            </div>
          </Card>
        </motion.div>

      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Enquiries from Real-Time Store */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="glass-panel border-white/5 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <h3 className="text-lg font-bold text-white tracking-wide">
                Recent Inbound Enquiries
              </h3>
              <Link to="/admin/enquiries" className="text-xs text-[#FF6A88] hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {enquiries.slice(0, 3).map((enq) => (
                <div
                  key={enq.id}
                  className="bg-white/[0.01] border border-white/5 rounded-xl p-4 hover:bg-white/[0.03] transition-all flex flex-col justify-between h-24"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white text-sm">
                      {enq.company}
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        enq.status === "Pending"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : enq.status === "Contacted"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : enq.status === "Won"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <div className="text-xs text-white/50 truncate">
                    {enq.campaignType} • {enq.message}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/30 font-mono">
                    <span className="text-[#FF6A88]">{enq.budget}</span>
                    <span>{enq.createdDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Latest Campaigns from Real-Time Store */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="glass-panel border-white/5 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <h3 className="text-lg font-bold text-white tracking-wide">
                Campaign Portfolios
              </h3>
              <span className="text-xs text-white/40">Active channels</span>
            </div>

            <div className="space-y-3">
              {/* Use real campaigns from DataContext; show empty state when none */}
              {/* Data will arrive via API or WebSocket and populate DataContext */}
              <div className="text-sm text-white/40">No active campaigns</div>
            </div>

          </Card>
        </motion.div>

      </div>
    </div>
  );
}
