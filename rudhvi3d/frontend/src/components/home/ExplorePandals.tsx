import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Lock, Crown, CheckCircle, Sparkles, X, ShieldCheck, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { pandalsData, Pandal } from "../../data/pandals";
import { API_BASE_URL, VR_VIEWER_URL } from "../../config/api";

const featureIcons: Record<string, string> = {
  "360° View": "/images/icons/360 degree.png",
  "Day & Night": "/images/icons/day night experience.png",
  "3D Map": "/images/icons/map icon.png",
};

export default function ExplorePandals() {
  const navigate = useNavigate();
  const [pandals, setPandals] = useState<Pandal[]>(pandalsData);
  const [hasPass, setHasPass] = useState<boolean>(() => {
    return localStorage.getItem("puja3d_pass") === "true";
  });
  const [isPassModalOpen, setIsPassModalOpen] = useState<boolean>(false);
  const [selectedPandalForUnlock, setSelectedPandalForUnlock] = useState<Pandal | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/pandals`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.pandals) && data.pandals.length > 0) {
          const mapped: Pandal[] = data.pandals.map((p: any) => ({
            id: p.id,
            name: p.name,
            location: p.location,
            locationTag: p.locationTag || p.location.split(",")[0].toUpperCase(),
            image: p.image?.startsWith("/uploads") ? `${API_BASE_URL}${p.image}` : p.image,
            features: p.features || ["360° View", "Day & Night", "3D Map"],
            hasVR: true,
            has360: true,
            rating: p.rating || 4.8,
            accessType: p.accessType || "free",
            vrUrl: `${VR_VIEWER_URL}/?pandal=${p.id}`,
          }));
          setPandals(mapped);
        }
      })
      .catch((err) => console.log("Loaded static pandal defaults", err));
  }, []);

  const handleCardClick = (pandal: Pandal) => {
    const isLocked = pandal.accessType === "premium" && !hasPass;
    if (isLocked) {
      setSelectedPandalForUnlock(pandal);
      setIsPassModalOpen(true);
    } else {
      navigate(`/pandal/${pandal.id}`);
    }
  };

  const handleActivatePass = () => {
    localStorage.setItem("puja3d_pass", "true");
    setHasPass(true);
    setIsPassModalOpen(false);
    showToast("🎉 Puja3D Pass Activated! All Premium 360° Pandals are now Unlocked.");
  };

  return (
    <section id="explore" className="py-16 md:py-16 bg-rudhvi-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="section-title-dark">Explore Top Pandels in 360° &amp; VR</h2>
              {hasPass && (
                <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow">
                  <Crown className="w-3.5 h-3.5" /> Puja3D Pass Active
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm max-w-xl">
              Discover iconic Durga Puja pandals. Each pandal has its own dynamic 360° experience page.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!hasPass && (
              <button
                onClick={() => {
                  setSelectedPandalForUnlock(null);
                  setIsPassModalOpen(true);
                }}
                className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-md flex items-center gap-1.5 transition"
              >
                <Crown className="w-4 h-4 text-slate-950" /> Get Puja3D Pass
              </button>
            )}
            <a
              href={VR_VIEWER_URL}
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-red-700 transition-colors"
            >
              View All Pandals <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pandals.map((pandal, idx) => {
            const isLocked = pandal.accessType === "premium" && !hasPass;

            return (
              <motion.div
                key={pandal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleCardClick(pandal)}
                className="card-light group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={pandal.image}
                    alt={pandal.name}
                    className={`w-full h-48 sm:h-56 object-fill group-hover:scale-105 transition-transform duration-500 ${
                      isLocked ? "blur-[2px] brightness-75" : ""
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/pandel/p2.png";
                    }}
                  />

                  {/* Lock Blur Overlay for Premium Pandals */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px] flex flex-col items-center justify-center p-4 text-center z-10 transition-all group-hover:bg-black/60">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 text-amber-300 flex items-center justify-center mb-2 shadow-lg animate-pulse">
                        <Lock className="w-6 h-6" />
                      </div>
                      <span className="text-amber-200 font-serif font-bold text-sm tracking-wider uppercase mb-1">
                        Premium 360° Pandal
                      </span>
                      <button className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 shadow-lg flex items-center gap-1.5 transition">
                        <Crown className="w-3.5 h-3.5" /> Unlock Full Access · Get Pass
                      </button>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-md">
                      {pandal.locationTag}
                    </span>
                    {pandal.accessType === "premium" && (
                      <span className="bg-slate-950/80 text-amber-300 border border-amber-500/50 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-400" /> Premium
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                    <Link
                      to={`/pandal/${pandal.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-yellow-500/50 text-[10px] font-bold text-amber-300 flex items-center gap-1 hover:bg-amber-500 hover:text-slate-950 transition"
                      title="View Dynamic Pandal Page"
                    >
                      <Info className="w-3 h-3" /> Page
                    </Link>
                    <span className="h-8 w-8 inline-block p-1 bg-black/40 backdrop-blur-md rounded-full border border-yellow-500/50">
                      <img
                        src="/images/pandel/virtual-reality.png"
                        alt="VR Mode Available"
                        height={32}
                        width={32}
                      />
                    </span>
                  </div>

                  {pandal.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow z-20">
                      <Star size={12} className="text-gold-500 fill-gold-500" />
                      <span className="text-xs font-semibold text-gray-700">{pandal.rating}</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                      {pandal.name}
                    </h3>
                    {isLocked ? (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        View Page &amp; 360° ➔
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{pandal.location}</p>

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 justify-around">
                    {(pandal.features || ["360° View", "Day & Night", "3D Map"]).map((feat) => {
                      return (
                        <div key={feat} className="flex items-center gap-1.5">
                          <img
                            src={featureIcons[feat] || featureIcons["360° View"]}
                            alt=""
                            className="w-4 h-4 object-contain"
                          />
                          <span className="text-xs text-gray-500">{feat}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Puja3D Pass Unlock Modal */}
      <AnimatePresence>
        {isPassModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#120a1c] border-2 border-amber-500/50 rounded-3xl max-w-md w-full p-6 relative shadow-2xl text-slate-100"
            >
              <button
                onClick={() => setIsPassModalOpen(false)}
                className="absolute top-4 right-4 text-amber-400 hover:text-white w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 text-slate-950 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30">
                  <Crown className="w-8 h-8 text-slate-950" />
                </div>
                <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                  Get Puja3D Pass
                </h3>
                <p className="text-xs text-amber-200/80 mt-1">
                  {selectedPandalForUnlock
                    ? `Unlock "${selectedPandalForUnlock.name}" & all premium 360° VR pandal experiences!`
                    : "Unlock full unlimited 360° & stereoscopic VR access to all premium Kolkata Durga Puja pandals."}
                </p>
              </div>

              <div className="space-y-2.5 mb-6 bg-[#0a0512] p-4 rounded-2xl border border-amber-500/30 text-xs">
                <div className="flex items-center gap-2.5 text-gray-200">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Full 360° interior & exterior high-res panoramas</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-200">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Google Cardboard & stereoscopic VR headset mode</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-200">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>3D Anaglyph Red/Cyan view mode for 3D glasses</span>
                </div>
              </div>

              <button
                onClick={handleActivatePass}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" /> Unlock All Premium Pandals (Festive Pass ₹99)
              </button>

              <p className="text-[11px] text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Instant Access · One-click activation
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border border-amber-500/50 bg-[#120a1c] font-semibold text-xs text-amber-200 shadow-2xl flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
