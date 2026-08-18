import { motion } from "framer-motion";
import { useMemo } from "react";
import { TypeAnimation } from "react-type-animation";
import { Play, RectangleGoggles, MapPin, ScanEye } from "lucide-react";
import {
  heroContent,
  heroFeaturedCard,
  heroFeatures,
  heroStats,
} from "../../data/hero";

export default function HeroSection() {
  const stars = useMemo(
    () =>
      Array.from({ length: 35 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 5,
      })),
    [],
  );
  return (
    <section className="relative pt-16 md:pt-20 overflow-hidden flex items-center bg-rudhvi-dark ">
      {/* Animated stars */}
      <div className="hero-stars">
        {stars.map((star, i) => (
          <span
            key={i}
            className="hero-star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-0 bg-rudhvi-dark" />

      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-rudhvi-dark via-rudhvi-dark/95 to-transparent z-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gold-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute right-0 top-0 z-0 w-full md:w-[62%] h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rudhvi-dark/95 via-rudhvi-dark/75 to-rudhvi-dark/15 z-10 md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-rudhvi-dark via-transparent to-rudhvi-dark/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-rudhvi-dark z-10" />

        <img
          src={heroContent.backgroundImage}
          alt={heroFeaturedCard.title}
          className="absolute left-0 lg:-left-14 right-0 top-10 h-full w-auto min-w-[760px] object-cover object-right opacity-90"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 28%, black 72%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 28%, black 72%, transparent 100%)",
          }}
        />

        <div className="absolute -left-20 top-1/4 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl" />
        <div className="absolute -left-10 bottom-1/4 w-48 h-48 bg-gold-300/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 xl:col-span-7"
          >
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gold-400 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3"
            >
              {heroContent.subtitle}
            </motion.p>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif leading-[1.05] mb-4"
            >
              <span className="block text-white text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold tracking-widest">
                {heroContent.titleLine1}
              </span>

              <span className="block text-gradient-gold text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                <TypeAnimation
                  sequence={[heroContent.titleLine2, 3000, "", 500]}
                  speed={50}
                  deletionSpeed={70}
                  repeat={Infinity}
                  cursor={true}
                />
              </span>
            </motion.h1>
            <div className="mb-1 md:my-1 w-1/2 md:w-full">
              <img src="/images/hero/3d-hero-element2.png" alt="" />
            </div>
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-base md:text-lg leading-relaxed max-w-md mb-7"
            >
              {heroContent.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <button 
                onClick={() => window.location.href = 'http://localhost:5000'}
                className="btn-gold flex items-center gap-2 cursor-pointer"
              >
                <RectangleGoggles size={16} />
                {heroContent.ctaPrimary}
              </button>
              <button 
                onClick={() => window.location.href = 'http://localhost:5000'}
                className="btn-outline-gold text-white flex items-center gap-2 cursor-pointer"
              >
                <Play size={16} />
                {heroContent.ctaSecondary}
              </button>
            </motion.div>

            {/* Feature Icons Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 md:gap-6 mb-7"
            >
              {heroFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-rudhvi-card/60 border border-rudhvi-border/60 flex items-center justify-center">
                    {feature.icon === "8K" && (
                      <span className="text-gold-400 text-[10px] font-bold">
                        <img
                          src="/images/hero/ultra hd.png"
                          alt=""
                          height={48}
                          width={48}
                        />
                      </span>
                    )}
                    {feature.icon === "360" && (
                      <span className="text-gold-400 text-[10px] font-bold">
                        <img
                          src="/images/hero/360 degree.png"
                          alt=""
                          height={48}
                          width={48}
                        />
                      </span>
                    )}
                    {feature.icon === "spatial" && (
                      <span className="text-gold-400 text-[10px] font-bold">
                        <img
                          src="/images/hero/music icon.png"
                          alt=""
                          height={48}
                          width={48}
                        />
                      </span>
                    )}
                    {feature.icon === "vr" && (
                      <span className="text-gold-400 text-[10px] font-bold">
                        <img
                          src="/images/hero/vr.png"
                          alt=""
                          height={48}
                          width={48}
                        />
                      </span>
                    )}
                    {feature.icon === "multi" && (
                      <span className="text-gold-400 text-[10px] font-bold">
                        <img
                          src="/images/hero/multi device.png"
                          alt=""
                          height={48}
                          width={48}
                        />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-semibold leading-tight">
                      {feature.value}
                    </span>
                    <span className="text-gray-500 text-[10px] leading-tight">
                      {feature.label}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Online Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {heroStats.avatars.map((avatar, i) => (
                  <div key={i} className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={avatar}
                      alt={`Devotee ${i + 1}`}
                      className="w-full h-full object-fill"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gold-400 font-bold text-sm">
                  {heroStats.onlineUsers}
                </span>
                <span className="text-gray-400 text-xs">
                  {heroStats.onlineLabel}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="hidden lg:block absolute right-[5%] bottom-[8%] z-30 w-[280px] rounded-3xl border border-white/20 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img
              src={heroFeaturedCard.image}
              alt={heroFeaturedCard.title}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gold-400/40"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gold-500 border-2 border-white flex items-center justify-center">
              <ScanEye size={10} className="text-black" />
            </div>
          </div>
          <div>
            <div className="font-mono capitalize text-lg font-bold text-gray-300">
              {heroFeaturedCard.title}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-600 uppercase tracking-wide">
              <MapPin size={12} />
              {heroFeaturedCard.location}
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-2xl bg-rudhvi-dark/95 p-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300">
            {heroFeaturedCard.badge}
          </div>
          {/* <p className="text-sm leading-relaxed text-gray-200">
            Step inside a premium 360 degree pandal experience in ultra HD.
          </p> */}
        </div>

        <button 
          onClick={() => window.location.href = 'http://localhost:5000'}
          className="w-full rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 px-4 py-3 text-sm font-bold text-black transition-all hover:shadow-lg hover:shadow-gold-500/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          {heroFeaturedCard.cta}
          <RectangleGoggles size={16} />
        </button>
      </motion.div>
    </section>
  );
}
