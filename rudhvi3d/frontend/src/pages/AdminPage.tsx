import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Plus,
  RotateCw,
  Eye,
  Edit,
  Trash2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Camera,
  Star,
  MapPin,
  Globe,
  Home,
  ShieldCheck,
  Image as ImageIcon,
  Layers,
  AlertTriangle,
  LogOut,
  Tag,
  ToggleLeft,
  ToggleRight,
  Flame,
  Award,
  Crown,
  ExternalLink,
  ArrowUpDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLoginPage from "./AdminLoginPage";

interface PandalItem {
  id: string;
  name: string;
  location: string;
  locationTag?: string;
  image: string;
  rating?: number;
  description?: string;
  status?: "active" | "inactive" | "archived";
  isFeatured?: boolean;
  isNew?: boolean;
  accessType?: "free" | "premium";
  displayOrder?: number;
  mapUrl?: string;
  hasExterior360?: boolean;
  hasInterior360?: boolean;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("rudhvi_admin_auth") === "true";
  });

  const [pandals, setPandals] = useState<PandalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPandal, setEditingPandal] = useState<PandalItem | null>(null);
  const [deleteTargetPandal, setDeleteTargetPandal] = useState<PandalItem | null>(null);

  // Comprehensive Form State
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [locationTag, setLocationTag] = useState<string>("");
  const [rating, setRating] = useState<number>(4.8);
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<"active" | "inactive" | "archived">("active");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [accessType, setAccessType] = useState<"free" | "premium">("free");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [mapUrl, setMapUrl] = useState<string>("");

  // Media File State
  const [cardImageFile, setCardImageFile] = useState<File | null>(null);
  const [exterior360File, setExterior360File] = useState<File | null>(null);
  const [interior360File, setInterior360File] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPandals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/pandals`);
      const data = await res.json();
      if (data.success && Array.isArray(data.pandals)) {
        setPandals(data.pandals);
      }
    } catch (err) {
      console.error("Error fetching pandals:", err);
      showToast("Failed to connect to backend server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPandals();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem("rudhvi_admin_auth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginPage onSuccess={() => setIsAuthenticated(true)} />;
  }

  const openCreateModal = () => {
    setEditingPandal(null);
    setName("");
    setLocation("");
    setLocationTag("");
    setRating(4.8);
    setDescription("");
    setStatus("active");
    setIsFeatured(false);
    setIsNew(true);
    setAccessType("free");
    setDisplayOrder(pandals.length + 1);
    setMapUrl("");
    setCardImageFile(null);
    setExterior360File(null);
    setInterior360File(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pandal: PandalItem) => {
    setEditingPandal(pandal);
    setName(pandal.name);
    setLocation(pandal.location);
    setLocationTag(pandal.locationTag || "");
    setRating(pandal.rating || 4.8);
    setDescription(pandal.description || "");
    setStatus(pandal.status || "active");
    setIsFeatured(Boolean(pandal.isFeatured));
    setIsNew(Boolean(pandal.isNew));
    setAccessType(pandal.accessType || "free");
    setDisplayOrder(pandal.displayOrder || 1);
    setMapUrl(pandal.mapUrl || "");
    setCardImageFile(null);
    setExterior360File(null);
    setInterior360File(null);
    setIsModalOpen(true);
  };

  const toggleStatusQuick = async (pandal: PandalItem) => {
    const nextStatus = pandal.status === "active" ? "inactive" : "active";
    setPandals((prev) =>
      prev.map((p) => (p.id === pandal.id ? { ...p, status: nextStatus } : p))
    );
    try {
      const res = await fetch(`${API_BASE_URL}/api/pandals/${pandal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Pandal status set to ${nextStatus.toUpperCase()}`, "success");
        fetchPandals();
      } else {
        fetchPandals();
      }
    } catch (err) {
      showToast("Error updating status", "error");
      fetchPandals();
    }
  };

  const toggleAccessTypeQuick = async (pandal: PandalItem) => {
    const nextAccess = pandal.accessType === "premium" ? "free" : "premium";
    setPandals((prev) =>
      prev.map((p) => (p.id === pandal.id ? { ...p, accessType: nextAccess } : p))
    );
    try {
      const res = await fetch(`${API_BASE_URL}/api/pandals/${pandal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessType: nextAccess }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Pandal access set to ${nextAccess.toUpperCase()}`, "success");
        fetchPandals();
      } else {
        fetchPandals();
      }
    } catch (err) {
      showToast("Error updating access type", "error");
      fetchPandals();
    }
  };


  const handleDeleteRequest = (pandal: PandalItem) => {
    setDeleteTargetPandal(pandal);
  };

  const confirmDeletePandal = async () => {
    if (!deleteTargetPandal) return;
    const id = deleteTargetPandal.id;
    try {
      const res = await fetch(`${API_BASE_URL}/api/pandals/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`"${deleteTargetPandal.name}" removed successfully`, "success");
        setDeleteTargetPandal(null);
        fetchPandals();
      } else {
        showToast(data.message || "Failed to delete pandal", "error");
      }
    } catch (err) {
      console.error("Error deleting pandal:", err);
      showToast("Server connection error", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("locationTag", locationTag);
    formData.append("rating", rating.toString());
    formData.append("description", description);
    formData.append("status", status);
    formData.append("isFeatured", isFeatured.toString());
    formData.append("isNew", isNew.toString());
    formData.append("accessType", accessType);
    formData.append("displayOrder", displayOrder.toString());
    formData.append("mapUrl", mapUrl);

    if (cardImageFile) formData.append("cardImage", cardImageFile);
    if (exterior360File) formData.append("exterior360", exterior360File);
    if (interior360File) formData.append("interior360", interior360File);

    const isEdit = Boolean(editingPandal);
    const url = isEdit ? `${API_BASE_URL}/api/pandals/${editingPandal?.id}` : `${API_BASE_URL}/api/pandals`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "Pandal details & media updated!" : "New 360 Pandal created!", "success");
        setIsModalOpen(false);
        fetchPandals();
      } else {
        showToast(data.message || "Error submitting pandal", "error");
      }
    } catch (err) {
      console.error("Submit error:", err);
      showToast("Failed to upload content to server", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPandals = pandals.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalExterior360Count = pandals.filter((p) => p.hasExterior360).length;
  const totalInterior360Count = pandals.filter((p) => p.hasInterior360).length;
  const activeCount = pandals.filter((p) => (p.status || "active") === "active").length;
  const featuredCount = pandals.filter((p) => p.isFeatured).length;

  return (
    <div className="min-h-screen bg-[#08040d] text-slate-100 pb-20 font-sans">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0e0717]/90 backdrop-blur-xl border-b border-amber-500/30 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-600 text-slate-950 font-bold flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 bg-clip-text text-transparent tracking-wider">
              RUDHVI3D ADMIN PORTAL
            </h1>
            <p className="text-xs text-amber-200/70">React Content Management & 360° Media Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-amber-500/30 text-amber-200 hover:bg-amber-500/20 hover:text-white transition flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> React App
          </Link>
          <a
            href={API_BASE_URL}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-amber-500/30 text-amber-200 hover:bg-amber-500/20 hover:text-white transition flex items-center gap-2"
          >
            <Globe className="w-4 h-4" /> Open 360 Viewer
          </a>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Pandal
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/40 text-red-300 hover:bg-red-500/20 hover:text-white transition flex items-center gap-2"
            title="Log Out of Admin Portal"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-[#120a1c]/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-amber-300">{pandals.length}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Pandals</div>
            </div>
          </div>

          <div className="bg-[#120a1c]/80 backdrop-blur-xl border border-green-500/30 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/30">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-green-300">{activeCount} Active</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Live & Visible</div>
            </div>
          </div>

          <div className="bg-[#120a1c]/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-purple-300">{featuredCount} Featured</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Top Priority Showcase</div>
            </div>
          </div>

          <div className="bg-[#120a1c]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold font-serif text-cyan-300">{totalExterior360Count + totalInterior360Count}</div>
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">360° Panoramas</div>
            </div>
          </div>
        </div>

        {/* Section Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-amber-300">Pandal Management Directory</h2>
            <p className="text-xs text-gray-400">Configure statuses, display orders, location tags, and media assets</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0f071a] border border-amber-500/30 rounded-xl px-4 py-2 text-xs text-amber-200 placeholder-gray-500 focus:outline-none focus:border-amber-400 w-64"
            />
            <button
              onClick={fetchPandals}
              className="p-2 rounded-xl border border-amber-500/30 bg-white/5 text-amber-300 hover:bg-amber-500/20 transition"
              title="Refresh Directory"
            >
              <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Pandals Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RotateCw className="w-8 h-8 text-amber-400 animate-spin mb-3" />
            <p className="text-sm">Fetching pandal directory from API...</p>
          </div>
        ) : filteredPandals.length === 0 ? (
          <div className="bg-[#120a1c]/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-12 text-center text-gray-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-amber-500/60" />
            <p className="text-sm">No pandals found matching your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPandals.map((pandal) => {
              const imageSrc = pandal.image?.startsWith("/uploads")
                ? `${API_BASE_URL}${pandal.image}`
                : pandal.image;
              const isPandalActive = (pandal.status || "active") === "active";

              return (
                <motion.div
                  key={pandal.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-[#120a1c]/80 backdrop-blur-xl border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group shadow-xl ${
                    isPandalActive
                      ? "border-amber-500/30 hover:border-amber-400/60"
                      : "border-gray-700/50 opacity-75"
                  }`}
                >
                  <div>
                    <div className="relative overflow-hidden rounded-xl h-48 mb-4 border border-amber-500/30">
                      <img
                        src={imageSrc}
                        alt={pandal.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/pandel/p2.png";
                        }}
                      />
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        <div className="bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow">
                          {pandal.locationTag || "PUJA"}
                        </div>
                        {pandal.isFeatured && (
                          <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                            <Award className="w-3 h-3" /> Featured
                          </div>
                        )}
                        {pandal.isNew && (
                          <div className="bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                            <Flame className="w-3 h-3" /> New
                          </div>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        <div className="bg-slate-950/80 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/40 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {pandal.rating || 4.8}
                        </div>
                        <div className="bg-slate-950/80 text-amber-200 text-xs font-bold px-2 py-1 rounded-full border border-amber-500/30">
                          #{pandal.displayOrder || 1}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg font-bold text-amber-300">{pandal.name}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                              isPandalActive
                                ? "bg-green-500/20 text-green-300 border-green-500/40"
                                : pandal.status === "archived"
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                : "bg-red-500/20 text-red-300 border-red-500/40"
                            }`}
                          >
                            {pandal.status || "active"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" /> {pandal.location}
                          {pandal.mapUrl && (
                            <a
                              href={pandal.mapUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-amber-400 hover:underline flex items-center gap-0.5 ml-1"
                            >
                              (Map <ExternalLink className="w-2.5 h-2.5" />)
                            </a>
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleStatusQuick(pandal)}
                        className={`p-1.5 rounded-lg border transition ${
                          isPandalActive
                            ? "bg-green-500/20 text-green-300 border-green-500/40 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30"
                        }`}
                        title={isPandalActive ? "Deactivate Pandal" : "Activate Pandal"}
                      >
                        {isPandalActive ? (
                          <ToggleRight className="w-5 h-5" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-gray-300/80 line-clamp-2 mb-4">
                      {pandal.description || "360° Virtual Tour & 3D VR Pandal Experience."}
                    </p>

                    {/* Media Badges & Access Badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <button
                        onClick={() => toggleAccessTypeQuick(pandal)}
                        title="Click to toggle Free / Premium Access level"
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition hover:brightness-125 ${
                          pandal.accessType === "premium"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                        }`}
                      >
                        {pandal.accessType === "premium" ? (
                          <>
                            <Crown className="w-3 h-3 text-amber-400" /> Premium Access
                          </>
                        ) : (
                          <>🔓 Free Access</>
                        )}
                      </button>

                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                          pandal.hasExterior360
                            ? "bg-green-500/20 text-green-300 border border-green-500/40"
                            : "bg-gray-800 text-gray-500"
                        }`}
                      >
                        <Camera className="w-3 h-3" /> Exterior 360
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                          pandal.hasInterior360
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "bg-gray-800 text-gray-500"
                        }`}
                      >
                        <Camera className="w-3 h-3" /> Interior 360
                      </span>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" /> 3D VR Ready
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-amber-500/20 gap-2">
                    <a
                      href={`${API_BASE_URL}/?pandal=${pandal.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 flex items-center gap-1.5 shadow"
                    >
                      <Eye className="w-3.5 h-3.5" /> Launch 360 Viewer
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(pandal)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition flex items-center gap-1"
                        title="Edit Pandal"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(pandal)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold border border-red-500/40 text-red-400 hover:bg-red-500/20 transition flex items-center gap-1"
                        title="Delete Pandal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add / Edit Pandal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#120a1c] border-2 border-amber-500/50 rounded-2xl max-w-3xl w-full p-6 relative shadow-2xl my-8 text-slate-100"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-amber-400 hover:text-white w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-xl font-bold text-amber-300 mb-1">
                {editingPandal ? `Edit Pandal: ${editingPandal.name}` : "Create New Durga Puja Pandal"}
              </h3>
              <p className="text-xs text-gray-400 mb-5">
                Set pandal details, status, featured flags, location maps, and upload 360° VR panoramas
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1">Pandal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Town Puja"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0a0512] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-yellow-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1">Area / Locality *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Town, Kolkata"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#0a0512] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-yellow-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1">Location Tag / Code</label>
                    <input
                      type="text"
                      placeholder="e.g. NEW TOWN"
                      value={locationTag}
                      onChange={(e) => setLocationTag(e.target.value)}
                      className="w-full bg-[#0a0512] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-yellow-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1">Display Order</label>
                    <input
                      type="number"
                      min="1"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#0a0512] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-yellow-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1">Rating (1 - 5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(parseFloat(e.target.value))}
                      className="w-full bg-[#0a0512] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-yellow-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Status, Flags & Access Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-amber-500/20">
                  <div>
                    <label className="block text-xs font-semibold text-green-300 mb-1">Pandal Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-[#0a0512] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-yellow-200 focus:outline-none focus:border-amber-400"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="inactive">Inactive (Hidden)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-300 mb-1">Access Tier</label>
                    <select
                      value={accessType}
                      onChange={(e) => setAccessType(e.target.value as any)}
                      className="w-full bg-[#0a0512] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-yellow-200 focus:outline-none focus:border-amber-400"
                    >
                      <option value="free">Free Access</option>
                      <option value="premium">Premium Access</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="rounded border-amber-500 text-amber-500 focus:ring-amber-400"
                      />
                      <span>Featured</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-emerald-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isNew}
                        onChange={(e) => setIsNew(e.target.checked)}
                        className="rounded border-emerald-500 text-emerald-500 focus:ring-emerald-400"
                      />
                      <span>Mark New</span>
                    </label>
                  </div>
                </div>

                {/* Map Link & Description */}
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">Google Maps Location URL</label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/?q=..."
                    value={mapUrl}
                    onChange={(e) => setMapUrl(e.target.value)}
                    className="w-full bg-[#0a0512] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-yellow-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the pandal architecture and theme..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0a0512] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-yellow-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Media Uploads */}
                <div className="space-y-3 pt-3 border-t border-amber-500/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Media Assets Upload (360°, VR & Thumbnail)</h4>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      1) Pandal Thumbnail Card Image (JPG/PNG)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCardImageFile(e.target.files?.[0] || null)}
                      className="w-full bg-[#0a0512] border border-amber-500/30 rounded-xl p-2 text-xs text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-cyan-300 mb-1">
                        2) 360° Exterior Panorama Asset
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setExterior360File(e.target.files?.[0] || null)}
                        className="w-full bg-[#0a0512] border border-cyan-500/30 rounded-xl p-2 text-xs text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-yellow-300 mb-1">
                        3) 360° Interior Panorama Asset
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setInterior360File(e.target.files?.[0] || null)}
                        className="w-full bg-[#0a0512] border border-yellow-500/30 rounded-xl p-2 text-xs text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-yellow-500/20 file:text-yellow-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-amber-500/20">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 text-amber-200 hover:bg-amber-500/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 flex items-center gap-2 shadow"
                  >
                    {submitting ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> Save Pandal & Media
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTargetPandal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#180812] border-2 border-red-500/50 rounded-2xl max-w-md w-full p-6 relative shadow-2xl text-slate-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-red-300">Confirm Deletion</h3>
                  <p className="text-xs text-gray-400">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 mb-6">
                Are you sure you want to delete <strong className="text-amber-300">{deleteTargetPandal.name}</strong> from the 360° virtual tour directory?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTargetPandal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-amber-500/30 text-amber-200 hover:bg-amber-500/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeletePandal}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-red-500 text-white hover:brightness-110 flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
                >
                  <Trash2 className="w-4 h-4" /> Yes, Delete Pandal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border font-semibold text-xs shadow-2xl flex items-center gap-2.5 ${
              toast.type === "success"
                ? "bg-[#120a1c] border-amber-500/50 text-amber-200"
                : "bg-[#1f0910] border-red-500/50 text-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-amber-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
