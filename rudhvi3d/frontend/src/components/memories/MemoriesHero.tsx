import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { heroStats } from "../../data/hero";

const badges = [
  {
    icon: "/images/memories-icons/ai technology.png",
    label: "AI 3D Technology",
  },
  { icon: "/images/memories-icons/depth.png", label: "Realistic 3D Depth" },
  {
    icon: "/images/memories-icons/realistic sound.png",
    label: "Ambient Sounds",
  },
  { icon: "/images/memories-icons/share 2.png", label: "Share & Cherish" },
];

export default function MemoriesHero() {
  return (
    <section className="pt-20 md:pt-32 md:pb-20 overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-red-600 text-sm font-semibold tracking-widest uppercase mb-2">
              INTRODUCING
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] text-gray-900 mb-2">
              YOUR PUJA.
              <br />
              YOUR PEOPLE.
              <br />
              <span className="text-red-700">YOUR MOMENTS.</span>
            </h1>

            <div className="my-2">
              <img src="/images/hero/3d-hero-element2.png" alt="" />
            </div>

            <p className="text-gray-600 text-lg leading-relaxed max-w-lg mb-6">
              Turn your favorite Puja photos into immersive 3D memories and
              relive the moment like never before.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2"
                >
                  <img
                    src={badge.icon}
                    alt={badge.label}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-xs text-gray-700 font-medium">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <button className="btn-red flex items-center gap-2">
                Create My 3D Memory &ndash; From ₹49 <ArrowRight size={16} />
              </button>
              <button className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full hover:border-red-400 transition-colors">
                <Play size={16} /> Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {heroStats.avatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-white flex items-center justify-center"
                  >
                    <img
                      src={avatar}
                      alt={`Devotee ${i + 1}`}
                      className="w-full h-full object-fill"
                    />
                  </div>
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                <span className="font-bold text-gray-900">25,000+</span>{" "}
                memories created this Puja
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4 justify-center items-center">
              <div className="space-y-2">
                <p className="text-center text-xs font-semibold text-gray-500 uppercase">
                  Your Photo
                </p>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/images/hero/2d photo.png"
                    alt="Original Photo"
                    className="w-full h-56 sm:h-72 object-cover"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-center text-xs font-semibold text-gray-500 uppercase">
                    Your 3D Memory
                  </p>
                  <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    3D
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-gold-200/20">
                  <img
                    src="/images/hero/3d.png"
                    alt="3D Memory"
                    className="w-full h-56 sm:h-auto object-fill brightness-110 saturate-110"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-gray-200">
              {[
                "Relive in 3D with Sound",
                "Realistic Depth & Animation",
                "Share & Keep Forever",
              ].map((text) => (
                <p key={text} className="text-xs text-gray-500 text-center">
                  {text}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
