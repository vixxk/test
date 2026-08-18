import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Crown, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../../data/navigation";

interface NavbarProps {
  variant: "dark" | "light";
}

export default function Navbar({ variant }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasPass, setHasPass] = useState<boolean>(false);
  const location = useLocation();

  const isDark = variant === "dark";

  useEffect(() => {
    const checkPass = () => {
      setHasPass(localStorage.getItem("puja3d_pass") === "true");
    };
    checkPass();
    window.addEventListener("storage", checkPass);
    return () => window.removeEventListener("storage", checkPass);
  }, []);

  const togglePass = () => {
    if (hasPass) {
      localStorage.removeItem("puja3d_pass");
      setHasPass(false);
    } else {
      localStorage.setItem("puja3d_pass", "true");
      setHasPass(true);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        isDark
          ? "bg-rudhvi-dark/90 backdrop-blur-md border-b border-rudhvi-border"
          : "bg-white/90 backdrop-blur-md border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo/rudhvi-logo.png"
              alt="RUDHVI Immersive"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`relative text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                  location.pathname === link.href
                    ? isDark
                      ? "text-gold-400"
                      : "text-red-700"
                    : isDark
                    ? "text-gray-300 hover:text-gold-400"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="absolute -top-3 -right-3 text-[6px] leading-none bg-red-600 text-white px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wide">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={togglePass}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                hasPass
                  ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950"
                  : "bg-gray-800 text-amber-300 border border-amber-500/40 hover:bg-gray-700"
              }`}
              title="Click to toggle Puja3D Pass membership status"
            >
              {hasPass ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-slate-950 fill-slate-950" /> Puja3D Pass Active
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5 text-amber-400" /> Free Pass (Get Puja3D Pass)
                </>
              )}
            </button>

            <button
              className={`p-2 rounded-full transition-colors ${
                isDark ? "text-gray-300 hover:text-gold-400" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ShoppingCart size={20} />
            </button>
            <button
              className={`p-2 rounded-full transition-colors ${
                isDark ? "text-gray-300 hover:text-gold-400" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User size={20} />
            </button>
          </div>

          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? (
              <X size={24} className={isDark ? "text-white" : "text-gray-900"} />
            ) : (
              <Menu size={24} className={isDark ? "text-white" : "text-gray-900"} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden overflow-hidden ${
              isDark
                ? "bg-rudhvi-dark border-t border-rudhvi-border"
                : "bg-white border-t border-gray-200"
            }`}
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    isDark ? "text-gray-300 hover:text-gold-400" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-2 text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold uppercase">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <button
                onClick={togglePass}
                className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 flex items-center justify-center gap-1.5"
              >
                {hasPass ? "👑 Puja3D Pass Active" : "🔑 Get Puja3D Pass"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
