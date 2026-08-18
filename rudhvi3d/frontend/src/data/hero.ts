export interface HeroContent {
  id: string;
  subtitle: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  backgroundImage: string;
}

export interface HeroFeaturedCard {
  id: string;
  badge: string;
  title: string;
  location: string;
  image: string;
  has360: boolean;
  cta: string;
}

export interface HeroFeature {
  icon: string;
  value: string;
  label: string;
}

export interface HeroStats {
  onlineUsers: string;
  onlineLabel: string;
  avatars: string[];
}

export const heroContent: HeroContent = {
  id: "hero-main",
  subtitle: "ENTER THE WORLD'S FIRST",
  titleLine1: "IMMERSIVE",
  titleLine2: "DURGA PUJA",
  description:
    "Experience India's Greatest Festival in breathtaking 360° and VR.",
  ctaPrimary: "Start Free Preview",
  ctaSecondary: "Watch Trailer",
  backgroundImage: "/images/hero/hero-bg.png",
};

export const heroFeaturedCard: HeroFeaturedCard = {
  id: "featured-pandal-1",
  badge: "FEATURED PANDAL",
  title: "Kumartuli Park",
  location: "KOLKATA",
  image: "/images/hero/hero-card.png",
  has360: true,
  cta: "Explore Now",
};

export const heroFeatures: HeroFeature[] = [
  { icon: "8K", value: "8K", label: "ULTRA HD" },
  { icon: "360", value: "360°", label: "EXPERIENCE" },
  { icon: "spatial", value: "SPATIAL", label: "AUDIO" },
  { icon: "vr", value: "VR", label: "READY" },
  { icon: "multi", value: "MULTI DEVICE", label: "ACCESS" },
];

export const heroStats: HeroStats = {
  onlineUsers: "2.5K+",
  onlineLabel: "Devotees Online",
  avatars: [
    "/images/users/1.png",
    "/images/users/2.png",
    "/images/users/3.png",
    "/images/users/4.png",
    "/images/users/5.png",
  ],
};
