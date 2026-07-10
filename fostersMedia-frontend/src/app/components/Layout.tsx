import { Outlet, Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import { useAuthStore } from "../../store/authStore";
import logoImage from "../../assets/logo-fostersmedia.png";

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settings = useSettingsStore((s) => s.settings);
  const userType = useAuthStore((s) => s.userType);

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Influencers", path: "/influencers" },
    { name: "Events", path: "/events" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1115]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={logoImage} alt="Fosters Media" className="h-10 w-auto" />
              <span className="text-xl font-bold tracking-tight">{settings.logoText}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative py-2 transition-colors ${isActive(item.path)
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                    }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D66A4A]"
                      initial={false}
                      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
              {userType === "admin" && (
                <Link
                  to="/admin"
                  className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-[#0F1115]"
          >
            <div className="px-6 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-xl transition-colors ${isActive(item.path)
                    ? "bg-[#D66A4A]/10 text-[#D66A4A]"
                    : "text-white/60 hover:bg-white/5"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0F1115] border-t border-white/10 mt-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
                <div className="flex items-center space-x-2 mb-6">
                <img src={logoImage} alt="Fosters Media" className="h-10 w-auto" />
                <span className="text-xl font-bold">{settings.logoText}</span>
              </div>
              <p className="text-white/60 leading-relaxed">{settings.footerText}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/services" className="text-white/60 hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/influencers" className="text-white/60 hover:text-white transition-colors">
                    Influencers
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-white/60 hover:text-white transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="text-white/60 hover:text-white transition-colors">
                    Portfolio
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-6">Contact</h3>
              <ul className="space-y-3 text-white/60">
                <li>info@fostersmedia.com</li>
                <li>+1 (555) 123-4567</li>
                <li>Mumbai, India</li>
              </ul>
            </div>

            {/* Social & Newsletter */}
            <div>
              <h3 className="font-semibold mb-6">Stay Connected</h3>
              <div className="flex space-x-4 mb-6">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#D66A4A] outline-none transition-colors"
                />
                <button className="w-full px-4 py-2.5 rounded-xl bg-[#D66A4A] hover:bg-[#C55A3A] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2026 {settings.logoText}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
