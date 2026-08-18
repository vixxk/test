import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MapPin,
  Camera,
  Crown,
  Lock,
  ArrowLeft,
  Share2,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Eye,
  X,
  ShieldCheck,
  ChevronRight,
  Layers,
  Compass,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

interface PandalDetail {
  id: string;
  name: string;
  location: string;
  locationTag?: string;
  image: string;
  rating?: number;
  description?: string;
  status?: string;
  accessType?: "free" | "premium";
  mapUrl?: string;
  features?: string[];
  scenes?: {
    exterior?: { title: string; subtitle: string; image: string };
    interior?: { title: string; subtitle: string; image: string };
  };
}

const API_BASE_URL = "http://localhost:5000";

export default function PandalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pandal, setPandal] = useState<PandalDetail | null>(null);
  const [otherPandals, setOtherPandals] = useState<PandalDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasPass, setHasPass] = useState<boolean>(() => {
    return localStorage.getItem("puja3d_pass") === "true";
  });

  const [isPassModalOpen, setIsPassModalOpen] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/pandals/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.pandal) {
          setPandal(data.pandal);
        } else {
          // Fallback if not found
          fetch(`${API_BASE_URL}/api/pandals`)
            .then((r) => r.json())
            .then((allData) => {
              if (allData.pandals && allData.pandals.length > 0) {
                setPandal(allData.pandals[0]);
              }
            });
        }
      })
      .catch((err) => console.error("Error loading pandal detail:", err))
      .finally(() => setLoading(false));

    // Fetch catalogue for explore section
    fetch(`${API_BASE_URL}/api/pandals`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.pandals)) {
          setOtherPandals(data.pandals);
        }
      });
  }, [id]);

  const isLocked = pandal?.accessType === "premium" && !hasPass;

  const handleLaunch360 = () => {
    if (isLocked) {
      setIsPassModalOpen(true);
    } else {
      window.location.href = `${API_BASE_URL}/?pandal=${pandal?.id}`;
    }
  };

  const handleActivatePass = () => {
    localStorage.setItem("puja3d_pass", "true");
    setHasPass(true);
    setIsPassModalOpen(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08040d] text-white flex flex-col items-center justify-center font-sans">
        <Sparkles className="w-10 h-10 text-amber-400 animate-spin mb-4" />
        <p className="text-sm font-serif text-amber-200">Loading 360° Pandal Experience...</p>
      </div>
    );
  }

  if (!pandal) {
    return (
      <div className="min-h-screen bg-[#08040d] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-serif font-bold text-amber-300 mb-2">Pandal Not Found</h2>
        <p className="text-xs text-gray-400 mb-6">The requested Durga Puja pandal experience is unavailable.</p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Pandals Catalogue
        </Link>
      </div>
    );
  }

  const imageSrc = pandal.image?.startsWith("/uploads") ? `${API_BASE_URL}${pandal.image}` : pandal.image;
  const filteredOthers = otherPandals.filter((p) => p.id !== pandal.id);

  return (
    <div className="min-h-screen bg-[#08040d] text-slate-100 font-sans">
      <Navbar variant="dark" />

      {/* Hero Header Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-amber-500/10 via-purple-900/10 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="text-xs text-amber-300/80 hover:text-amber-200 flex items-center gap-1.5 transition font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Pandal Directory
            </Link>

            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-full bg-white/5 border border-amber-500/30 text-amber-200 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Experience
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Pandal Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-md shadow">
                  {pandal.locationTag || "KOLKATA PUJA"}
                </span>
                {pandal.accessType === "premium" ? (
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full shadow flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" /> Premium Access
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    🔓 Free Access
                  </span>
                )}
                {pandal.rating && (
                  <span className="bg-slate-950/80 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {pandal.rating}
                  </span>
                )}
              </div>

              <div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                  {pandal.name}
                </h1>
                <p className="text-sm text-gray-300 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-amber-400" /> {pandal.location}
                  {pandal.mapUrl && (
                    <a
                      href={pandal.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 ml-2 font-semibold text-xs"
                    >
                      (Google Maps <ExternalLink className="w-3 h-3" />)
                    </a>
                  )}
                </p>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {pandal.description ||
                  "Immerse yourself in full 360° equirectangular panoramas and 3D stereoscopic VR walkthroughs of this iconic Durga Puja pandal."}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={handleLaunch360}
                  className="px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-xl shadow-amber-500/25 transition flex items-center gap-2.5"
                >
                  {isLocked ? (
                    <>
                      <Lock className="w-4 h-4 text-slate-950" /> Unlock Full Access · Get Pass
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 text-slate-950" /> Launch 360° VR Walkthrough
                    </>
                  )}
                </button>

                {isLocked && (
                  <button
                    onClick={() => setIsPassModalOpen(true)}
                    className="px-5 py-3.5 rounded-2xl text-xs font-semibold border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 transition flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4 text-amber-400" /> Get Puja3D Pass
                  </button>
                )}
              </div>
            </motion.div>

            {/* Right Column: Pandal Media Card Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl group">
                <img
                  src={imageSrc}
                  alt={pandal.name}
                  className={`w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700 ${
                    isLocked ? "blur-[3px] brightness-75" : ""
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/pandel/p2.png";
                  }}
                />

                {/* Blur Overlay if Locked */}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 text-amber-300 flex items-center justify-center mb-3 shadow-lg animate-pulse">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h4 className="text-amber-200 font-serif font-bold text-lg mb-1">Premium Pandal Locked</h4>
                    <p className="text-xs text-gray-300 max-w-xs mb-4">
                      Get a Puja3D Pass to unlock high-res 360° interior & exterior VR modes.
                    </p>
                    <button
                      onClick={() => setIsPassModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 shadow-lg flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4" /> Unlock Full Access Now
                    </button>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/30 flex items-center justify-between z-20">
                  <div className="flex items-center gap-2 text-xs text-amber-200 font-medium">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>360° Interactive Equirectangular Panorama</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                    VR Ready
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pandal Experience Highlights */}
      <section className="py-12 bg-[#0c0614] border-t border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl font-bold text-amber-300">Virtual Experience Highlights</h2>
            <p className="text-xs text-gray-400 mt-1">Multi-perspective panoramic features included in this pandal page</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#120a1c] border border-amber-500/30 p-6 rounded-2xl shadow-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-amber-200 text-sm mb-1">Exterior & Interior Scenes</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Seamless portal transition arrow markers connecting the grand entryway courtyard directly to the sacred Durga Idol sanctum.
                </p>
              </div>
            </div>

            <div className="bg-[#120a1c] border border-amber-500/30 p-6 rounded-2xl shadow-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-amber-200 text-sm mb-1">3D Stereoscopic VR & Anaglyph</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Switch between standard 360° view, Google Cardboard VR split-screen, and Red/Cyan 3D Anaglyph glasses mode.
                </p>
              </div>
            </div>

            <div className="bg-[#120a1c] border border-amber-500/30 p-6 rounded-2xl shadow-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-amber-200 text-sm mb-1">Interactive Hotspot Guides</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Clickable spatial hotspots revealing detailed architectural facts, artisan craftsmanship, sponsor partners, and Bengali rituals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Pandals Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-amber-300">Explore More Kolkata Pandals</h2>
              <p className="text-xs text-gray-400 mt-1">Discover other iconic Durga Puja 360° virtual tours</p>
            </div>
            <Link
              to="/"
              className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
            >
              View All Catalogue <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {filteredOthers.slice(0, 3).map((item) => {
              const itemImg = item.image?.startsWith("/uploads") ? `${API_BASE_URL}${item.image}` : item.image;
              const itemLocked = item.accessType === "premium" && !hasPass;

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/pandal/${item.id}`)}
                  className="bg-[#120a1c] border border-amber-500/30 rounded-2xl p-4 cursor-pointer hover:border-amber-400/60 transition group shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="relative overflow-hidden rounded-xl h-40 mb-3 border border-amber-500/30">
                      <img
                        src={itemImg}
                        alt={item.name}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                          itemLocked ? "blur-[2px] brightness-75" : ""
                        }`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/pandel/p2.png";
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          {item.locationTag || "PUJA"}
                        </span>
                      </div>
                      {itemLocked && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-amber-300" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif text-base font-bold text-amber-300 group-hover:text-amber-200">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{item.location}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-amber-500/20 flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      View Experience ➔
                    </span>
                    {item.accessType === "premium" ? (
                      <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                        Premium
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                        Free
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
                  Unlock "{pandal.name}" & all premium 360° VR pandal experiences across Kolkata!
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

      {/* Share Toast */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border border-amber-500/50 bg-[#120a1c] font-semibold text-xs text-amber-200 shadow-2xl flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-amber-400" />
            <span>Pandal page URL copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer variant="dark" />
    </div>
  );
}
