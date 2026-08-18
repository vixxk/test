import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminLoginPageProps {
  onSuccess?: () => void;
  isStandaloneAdmin?: boolean;
}

export default function AdminLoginPage({ onSuccess, isStandaloneAdmin = false }: AdminLoginPageProps) {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const expectedPassword = (import.meta as any).env?.VITE_ADMIN_PASSWORD || "rudhvi@321";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (password === expectedPassword) {
        sessionStorage.setItem("rudhvi_admin_auth", "true");
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        setError("Invalid Admin Password. Please verify credentials.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#08040d] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#120a1c]/90 backdrop-blur-2xl border-2 border-amber-500/40 rounded-3xl p-8 relative z-10 shadow-2xl shadow-amber-500/10"
      >
        {/* Top Header & Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-600 text-slate-950 flex items-center justify-center mb-4 shadow-xl shadow-amber-500/25 border border-amber-300/40">
            <Lock className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="font-serif text-2xl font-bold bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 bg-clip-text text-transparent tracking-wider">
            RUDHVI3D ADMIN STUDIO
          </h1>
          <p className="text-xs text-amber-200/70 mt-1 flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Authorized Portal Access Only
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-amber-300 mb-2 tracking-wide uppercase">
              Admin Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/70">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full bg-[#0a0512] border border-amber-500/30 rounded-xl pl-10 pr-11 py-3 text-sm text-yellow-100 placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-amber-400/70 hover:text-amber-300 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/40 rounded-xl p-3 flex items-center gap-2.5 text-red-300 text-xs font-semibold"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-950" /> Verifying Access...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-950" /> Authenticate & Access Admin Panel
              </>
            )}
          </button>
        </form>

        {/* Footer Return Link */}
        <div className="mt-8 pt-6 border-t border-amber-500/20 flex items-center justify-between text-xs text-gray-400">
          {isStandaloneAdmin ? (
            <a
              href="http://localhost:5173"
              className="hover:text-amber-300 transition flex items-center gap-1 text-amber-200/80"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </a>
          ) : (
            <Link
              to="/"
              className="hover:text-amber-300 transition flex items-center gap-1 text-amber-200/80"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
          )}

          <div className="flex items-center gap-1 text-gray-500 text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-500/60" /> Rudhvi3D Protected
          </div>
        </div>
      </motion.div>
    </div>
  );
}
