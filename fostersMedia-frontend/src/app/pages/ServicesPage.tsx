import { motion } from "motion/react";
import {
  Users,
  Calendar,
  Handshake,
  Star,
  TrendingUp,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router";

export function ServicesPage() {
  const services = [
    {
      icon: Users,
      title: "Influencer Management",
      description:
        "Access our curated network of verified influencers across all major platforms. We handle negotiations, contracts, and ensure seamless collaboration.",
      features: [
        "Verified creator database",
        "Contract management",
        "Performance tracking",
        "Content approval workflow",
      ],
    },
    {
      icon: Calendar,
      title: "Event Management",
      description:
        "From intimate brand activations to large-scale launches, we orchestrate unforgettable experiences with meticulous attention to detail.",
      features: [
        "Full event planning",
        "Venue coordination",
        "Guest management",
        "Live coverage",
      ],
    },
    {
      icon: Handshake,
      title: "Brand Collaborations",
      description:
        "Strategic partnerships between brands and creators that drive authentic engagement and measurable results for your campaigns.",
      features: [
        "Partnership strategy",
        "Brand alignment",
        "Creative direction",
        "Performance analytics",
      ],
    },
    {
      icon: Star,
      title: "Celebrity Appearances",
      description:
        "Book A-list celebrities and top-tier influencers for your events, product launches, and brand campaigns.",
      features: [
        "Celebrity booking",
        "Appearance coordination",
        "Photo & video rights",
        "Social media coverage",
      ],
    },
    {
      icon: TrendingUp,
      title: "Social Media Promotions",
      description:
        "Amplify your brand message with targeted social media campaigns that leverage influencer reach and engagement.",
      features: [
        "Campaign strategy",
        "Content creation",
        "Multi-platform distribution",
        "Real-time analytics",
      ],
    },
    {
      icon: Megaphone,
      title: "Campaign Management",
      description:
        "End-to-end campaign execution from concept to delivery, ensuring your brand message resonates with the right audience.",
      features: [
        "Strategic planning",
        "Creative development",
        "Influencer coordination",
        "ROI reporting",
      ],
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <Megaphone className="w-4 h-4 text-[#D66A4A]" />
            <span className="text-sm">Our Services</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Premium <span className="text-[#D66A4A]">Solutions</span> for Your
            Brand
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Comprehensive influencer marketing and event management services
            tailored to elevate your brand's presence and drive meaningful
            engagement.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all hover:border-[#D66A4A]/50 hover:shadow-2xl hover:shadow-[#D66A4A]/10">
                <div className="w-16 h-16 rounded-2xl bg-[#D66A4A]/20 flex items-center justify-center mb-6 group-hover:bg-[#D66A4A] transition-all group-hover:scale-110">
                  <service.icon className="w-8 h-8 text-[#D66A4A] group-hover:text-white transition-colors" />
                </div>

                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-white/60"
                    >
                      <ArrowRight className="w-4 h-4 text-[#D66A4A] mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 hover:bg-[#D66A4A] hover:border-[#D66A4A] hover:text-white rounded-full transition-all"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-[#D66A4A]">Process</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            A streamlined approach to delivering exceptional results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Discovery",
              description: "Understanding your brand goals and target audience",
            },
            {
              step: "02",
              title: "Strategy",
              description:
                "Creating a customized campaign or event strategy",
            },
            {
              step: "03",
              title: "Execution",
              description: "Seamless implementation with our expert team",
            },
            {
              step: "04",
              title: "Analysis",
              description: "Comprehensive reporting and performance insights",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                <div className="text-5xl font-bold text-[#D66A4A]/30 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/60">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#D66A4A]/20 to-[#D66A4A]/5 backdrop-blur-sm border border-[#D66A4A]/30 rounded-3xl p-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Campaign?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help you achieve your marketing and event
            goals.
          </p>
          <Link to="/contact">
            <Button
              size="lg"
              className="bg-[#D66A4A] hover:bg-[#D66A4A]/90 text-white rounded-full px-10 py-6 text-lg"
            >
              Schedule a Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
