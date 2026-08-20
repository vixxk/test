import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Play, RectangleGoggles, Minus, Home, Plus, Maximize } from "lucide-react";
import {
  heroContent,
  heroFeatures,
  heroStats,
} from "../../data/hero";
import { VR_VIEWER_URL } from "../../config/api";
import "./heroViewer.css";

declare global {
  interface Window {
    pannellum?: any;
  }
}

export default function HeroSection() {
  const [isDimmed, setIsDimmed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"normal" | "anaglyph" | "vr">("normal");
  const [guideDismissed, setGuideDismissed] = useState(false);
  const [cinematicSettled, setCinematicSettled] = useState(false);
  const [vrIntroduced, setVrIntroduced] = useState(false);

  const panoramaRef = useRef<HTMLDivElement>(null);
  const vrLeftRef = useRef<HTMLDivElement>(null);
  const vrRightRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const leftEyeRef = useRef<any>(null);
  const rightEyeRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

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

  // Initialize Pannellum 360 Viewer
  useEffect(() => {
    let checkInterval: any;

    const initPannellum = () => {
      if (!window.pannellum || !panoramaRef.current) return;
      if (viewerRef.current) return;

      try {
        const viewer = window.pannellum.viewer(panoramaRef.current, {
          default: {
            firstScene: "normal",
            sceneFadeDuration: 0,
            autoLoad: true,
            showControls: false,
            showFullscreenCtrl: false,
            compass: false,
            minHfov: 38,
            maxHfov: 120,
            friction: 1,
            mouseZoom: true,
            keyboardZoom: true,
            draggable: true,
            autoRotate: false,
            backgroundColor: [9, 6, 3],
          },
          scenes: {
            normal: {
              type: "equirectangular",
              panorama: "/assets/durga-puja-aligned-360-2026.png",
              pitch: -78,
              yaw: -18,
              hfov: 108,
            },
            anaglyph: {
              type: "equirectangular",
              panorama: "/assets/durga-puja-aligned-anaglyph-2026.png",
              pitch: -7,
              yaw: 0,
              hfov: 88,
            },
          },
        });

        viewerRef.current = viewer;

        viewer.on("load", () => {
          setIsLoading(false);
          setTimeout(() => {
            viewer.lookAt(-7, 0, 88, 2800);
          }, 350);
          setTimeout(() => {
            setCinematicSettled(true);
          }, 3250);
        });
      } catch (err) {
        console.error("Error initializing Pannellum:", err);
      }
    };

    if (window.pannellum) {
      initPannellum();
    } else {
      checkInterval = setInterval(() => {
        if (window.pannellum) {
          clearInterval(checkInterval);
          initPannellum();
        }
      }, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        viewerRef.current = null;
      }
    };
  }, []);

  // Interaction trigger to dim left side
  const handleInteraction = () => {
    setGuideDismissed(true);
    setIsDimmed(true);
  };

  // View Mode Switcher
  const handleModeSwitch = (mode: "normal" | "anaglyph" | "vr") => {
    handleInteraction();
    setViewMode(mode);

    if (!viewerRef.current) return;
    const pitch = viewerRef.current.getPitch();
    const yaw = viewerRef.current.getYaw();
    const hfov = viewerRef.current.getHfov();

    if (mode === "vr") {
      if (viewerRef.current.getScene() !== "normal") {
        viewerRef.current.loadScene("normal", pitch, yaw, hfov);
      }
      initStereoViewers(pitch, yaw, hfov);
      setVrIntroduced(false);
      setTimeout(() => setVrIntroduced(true), 50);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      viewerRef.current.loadScene(mode, pitch, yaw, hfov);
    }
  };

  // VR Dual Eye Stereo Initializer
  const initStereoViewers = (pitch: number, yaw: number, hfov: number) => {
    if (!window.pannellum) return;
    if (!leftEyeRef.current && vrLeftRef.current) {
      leftEyeRef.current = window.pannellum.viewer(vrLeftRef.current, {
        type: "equirectangular",
        panorama: "/assets/durga-puja-aligned-360-2026.png",
        autoLoad: true,
        showControls: false,
        showFullscreenCtrl: false,
        mouseZoom: false,
        keyboardZoom: false,
        draggable: false,
        autoRotate: false,
        hfov,
        pitch,
        yaw: yaw - 0.65,
      });
    }
    if (!rightEyeRef.current && vrRightRef.current) {
      rightEyeRef.current = window.pannellum.viewer(vrRightRef.current, {
        type: "equirectangular",
        panorama: "/assets/durga-puja-aligned-360-2026.png",
        autoLoad: true,
        showControls: false,
        showFullscreenCtrl: false,
        mouseZoom: false,
        keyboardZoom: false,
        draggable: false,
        autoRotate: false,
        hfov,
        pitch,
        yaw: yaw + 0.65,
      });
    }

    const syncStereo = () => {
      if (viewerRef.current && leftEyeRef.current && rightEyeRef.current) {
        const curYaw = viewerRef.current.getYaw();
        const curPitch = viewerRef.current.getPitch();
        const curHfov = viewerRef.current.getHfov();

        leftEyeRef.current.setYaw(curYaw - 0.65, false);
        rightEyeRef.current.setYaw(curYaw + 0.65, false);
        leftEyeRef.current.setPitch(curPitch, false);
        rightEyeRef.current.setPitch(curPitch, false);
        leftEyeRef.current.setHfov(curHfov, false);
        rightEyeRef.current.setHfov(curHfov, false);

        animationFrameRef.current = requestAnimationFrame(syncStereo);
      }
    };

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(syncStereo);
  };

  const handleZoomIn = () => {
    handleInteraction();
    if (viewerRef.current) {
      viewerRef.current.setHfov(Math.max(38, viewerRef.current.getHfov() - 10), 500);
    }
  };

  const handleZoomOut = () => {
    handleInteraction();
    if (viewerRef.current) {
      viewerRef.current.setHfov(Math.min(120, viewerRef.current.getHfov() + 10), 500);
    }
  };

  const handleResetView = () => {
    handleInteraction();
    if (viewerRef.current) {
      viewerRef.current.lookAt(-7, 0, 88, 900);
    }
  };

  const handleFullscreen = () => {
    handleInteraction();
    if (viewerRef.current) {
      viewerRef.current.toggleFullscreen();
    }
  };

  return (
    <section className="relative pt-16 md:pt-20 overflow-hidden flex items-center bg-rudhvi-dark min-h-[90vh]">
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

      {/* Glow overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-rudhvi-dark via-rudhvi-dark/95 to-transparent z-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gold-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-20 max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center justify-between">
          
          {/* Left Content (Original main website left hero section - Dimmable) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onMouseEnter={() => setIsDimmed(false)}
            className={`lg:col-span-5 xl:col-span-5 flex flex-col justify-center items-start hero-copy-dimmable ${isDimmed ? "dimmed" : ""}`}
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
                onClick={() => window.location.href = VR_VIEWER_URL}
                className="btn-gold flex items-center gap-2 cursor-pointer"
              >
                <RectangleGoggles size={16} />
                {heroContent.ctaPrimary}
              </button>
              <button 
                onClick={() => window.location.href = VR_VIEWER_URL}
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

          {/* Right Content: Replaced ONLY this specific section with netlify-site 360 viewer card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7 xl:col-span-7 relative w-full pt-3 pr-2 flex justify-end"
          >
            <div
              onPointerDown={handleInteraction}
              className={`camera-drop cinematic-in ${cinematicSettled ? "cinematic-settled" : ""}`}
            >
              {/* Pannellum 360 Host Canvas */}
              <div id="panorama" ref={panoramaRef} className="w-full h-full" />

              {/* Loading Indicator */}
              {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#080604]/90 text-[#d5c5a6] text-[10px] tracking-[0.2em] uppercase">
                  <div className="w-9 h-9 border border-white/20 border-t-[#d8a239] rounded-full animate-spin" />
                  <span>Preparing 360° experience</span>
                </div>
              )}

              {/* View Mode Switcher Overlay (Top Left) */}
              <div className="view-mode-switcher" onPointerDown={(e) => e.stopPropagation()}>
                <small>VIEW EXPERIENCE</small>
                <div>
                  <button
                    type="button"
                    className={viewMode === "normal" ? "active" : ""}
                    onClick={() => handleModeSwitch("normal")}
                  >
                    <span className="mode-360">360°</span>
                    <b>360 View</b>
                  </button>
                  <button
                    type="button"
                    className={viewMode === "anaglyph" ? "active" : ""}
                    onClick={() => handleModeSwitch("anaglyph")}
                  >
                    <span className="anaglyph-glasses">
                      <i />
                      <i />
                    </span>
                    <b>Anaglyph 360</b>
                  </button>
                  <button
                    type="button"
                    className={viewMode === "vr" ? "active" : ""}
                    onClick={() => handleModeSwitch("vr")}
                  >
                    <span className="vr-headset-icon" />
                    <b>VR SBS</b>
                  </button>
                </div>
                <em className="mode-status">
                  {viewMode === "normal"
                    ? "360 VIEW ACTIVE"
                    : viewMode === "anaglyph"
                    ? "ANAGLYPH 360 ACTIVE"
                    : "VR SBS OVERVIEW ACTIVE"}
                </em>
              </div>

              {/* Interactive Guide Overlay (Bottom Center) */}
              {!guideDismissed && (
                <div className="viewer-guide show">
                  <div className="guide-orbit">
                    <i />
                    <span>360°</span>
                  </div>
                  <div>
                    <small>INTERACTIVE VIEW</small>
                    <b>Move through the celebration</b>
                    <p>
                      <span className="mouse-symbol" /> Click + drag &nbsp;·&nbsp;{" "}
                      <span className="touch-symbol">↔</span> Swipe to explore
                    </p>
                  </div>
                </div>
              )}

              {/* Tour Control Buttons (Bottom Right) */}
              <div className="tour-controls" onPointerDown={(e) => e.stopPropagation()}>
                <button title="Zoom Out" onClick={handleZoomOut}>
                  <Minus size={15} />
                </button>
                <button title="Reset View" onClick={handleResetView}>
                  <Home size={15} />
                </button>
                <button title="Zoom In" onClick={handleZoomIn}>
                  <Plus size={15} />
                </button>
                <button title="Toggle Fullscreen" onClick={handleFullscreen}>
                  <Maximize size={14} />
                </button>
              </div>

              {/* VR SBS Dual Preview Overlay */}
              <div className={`vr-sbs-preview ${viewMode === "vr" ? "show" : ""}`}>
                <div className={`vr-eye-shell left ${vrIntroduced ? "introduced" : ""}`}>
                  <div className="vr-eye" ref={vrLeftRef} id="vrLeftEye" />
                </div>
                <div className={`vr-eye-shell right ${vrIntroduced ? "introduced" : ""}`}>
                  <div className="vr-eye" ref={vrRightRef} id="vrRightEye" />
                </div>
                <div className="vr-center-bridge" />
                <div className="vr-overview-label">
                  <small>VR SBS</small>
                  <b>360° SIDE-BY-SIDE OVERVIEW</b>
                </div>
              </div>
            </div>

            {/* Tour Location Badge Overlay (Extreme Top Right - Floating partially out of box) */}
            <div className="tour-location-floating">
              <span />
              <div>
                <small>YOU ARE VIEWING</small>
                <b>New Town Sarbojanin</b>
                <em>Kolkata · 2025</em>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
