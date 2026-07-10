import { motion } from "motion/react";
import { TrendingUp, Users, Target, Award } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { usePortfolio } from "../../hooks/usePortfolio";

export function PortfolioPage() {
  const { portfolio } = usePortfolio();

  const projects = portfolio ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
          <Award className="w-4 h-4 text-[#D66A4A]" />
          <span className="text-sm">Case Studies</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Our <span className="text-[#D66A4A]">Success Stories</span>
        </h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Discover how we've helped leading brands achieve remarkable results
          through strategic influencer partnerships and event management.
        </p>
      </motion.div>

      {/* Projects Grid */}
      <div className="space-y-12">
        {projects.length > 0 ? projects.map((project, index) => (
          <motion.div
            key={project.id ?? index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all hover:border-[#D66A4A]/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-96 lg:h-auto overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F1115]/80 to-transparent lg:opacity-0 lg:group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-[#D66A4A] rounded-full text-sm font-semibold">
                    {project.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="text-sm text-[#D66A4A] font-semibold mb-2">
                    {project.client}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {project.title}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex items-center text-sm text-white/60 mb-2">
                        <Target className="w-4 h-4 mr-2" />
                        Campaign Goal
                      </div>
                      <p className="text-white/90">{project.goal}</p>
                    </div>

                    <div>
                      <div className="text-sm text-white/60 mb-2">
                        Services Provided
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.services.map((service) => (
                          <span
                            key={service}
                            className="px-3 py-1 bg-white/5 rounded-full text-sm"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="bg-white/5 rounded-2xl p-6 mb-6">
                    <div className="text-sm text-white/60 mb-4 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-[#D66A4A]" />
                      Campaign Results
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-[#D66A4A] mb-1">
                          {project.results.impressions}
                        </div>
                        <div className="text-xs text-white/60">Impressions</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#D66A4A] mb-1">
                          {project.results.engagement}
                        </div>
                        <div className="text-xs text-white/60">Engagement</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#D66A4A] mb-1">
                          {project.results.sales}
                        </div>
                        <div className="text-xs text-white/60">Sales Lift</div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-[#D66A4A] hover:bg-[#D66A4A]/90 rounded-full">
                    View Full Case Study
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="text-center text-white/40">No case studies available</div>
        )}
      </div>
    </div>
  );
}
