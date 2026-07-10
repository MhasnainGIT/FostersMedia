import { motion } from "motion/react";
import { Calendar, MapPin, Users, Star, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import Masonry from "react-responsive-masonry";
import { useEvents } from "../../hooks/useEvents";

export function EventsShowcase() {
  const { events } = useEvents();

  const upcomingEvents = (events || []).filter((e) => e.status !== "Completed");
  const completedEvents = (events || []).filter((e) => e.status === "Completed");
  const galleryImages = (events || []).flatMap((e) => (e.gallery && e.gallery.length > 0 ? e.gallery : e.image ? [e.image] : []));

  return (
    <div className="relative overflow-hidden pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <Calendar className="w-4 h-4 text-[#D66A4A]" />
            <span className="text-sm">Events Portfolio</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Unforgettable <span className="text-[#D66A4A]">Events</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            From intimate brand activations to large-scale launches, we create
            memorable experiences that leave lasting impressions.
          </p>
        </motion.div>

        {/* Upcoming Events */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8"
          >
            Upcoming Events
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all hover:border-[#D66A4A]/50 hover:shadow-2xl hover:shadow-[#D66A4A]/10">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 px-4 py-2 bg-[#D66A4A] rounded-full text-xs font-semibold">
                      {event.status}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3">{event.title}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-white/60">
                        <Calendar className="w-4 h-4 mr-2 text-[#D66A4A]" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <MapPin className="w-4 h-4 mr-2 text-[#D66A4A]" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <Users className="w-4 h-4 mr-2 text-[#D66A4A]" />
                        {event.influencers} Influencers
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-white/60 mb-2">
                        Featured Brands:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {event.brands.map((brand) => (
                          <span
                            key={brand}
                            className="text-xs px-3 py-1 bg-white/5 rounded-full"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-[#D66A4A] hover:bg-[#D66A4A]/90 rounded-full">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completed Events */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8"
          >
            Completed Events
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {completedEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all">
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 px-4 py-2 bg-green-600 rounded-full text-xs font-semibold flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Success
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{event.title}</h3>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-2xl font-bold text-[#D66A4A]">
                          {event.attendees}
                        </div>
                        <div className="text-xs text-white/60">Attendees</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-2xl font-bold text-[#D66A4A]">
                          {event.influencers}
                        </div>
                        <div className="text-xs text-white/60">Influencers</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {event.brands.map((brand) => (
                        <span
                          key={brand}
                          className="text-xs px-3 py-1 bg-white/5 rounded-full"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-8">Event Gallery</h2>
          <Masonry columnsCount={3} gutter="1.5rem">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
              >
                <ImageWithFallback
                  src={image}
                  alt={`Event ${index + 1}`}
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#D66A4A]/0 group-hover:bg-[#D66A4A]/20 transition-colors" />
              </div>
            ))}
          </Masonry>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#D66A4A]/20 to-[#D66A4A]/5 backdrop-blur-sm border border-[#D66A4A]/30 rounded-3xl p-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Plan Your Next Event with Us
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Let's create an unforgettable experience for your brand
          </p>
          <Link to="/contact">
            <Button
              size="lg"
              className="bg-[#D66A4A] hover:bg-[#D66A4A]/90 text-white rounded-full px-10 py-6 text-lg"
            >
              Book an Event
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
