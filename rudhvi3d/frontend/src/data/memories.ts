export interface MemoryPlan {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  icon: string;
  badge: string | null;
  features: string[];
}

export const memoryPlansData: MemoryPlan[] = [
  {
    id: "photo-3d",
    name: "Photo to 3D Memory",
    price: "₹49",
    priceValue: 49,
    icon: "Star",
    badge: "BEST VALUE",
    features: [
      "1 Photo",
      "3D Depth & Effects",
      "Ambient Sound",
      "Share & Download",
    ],
  },
  {
    id: "couple-3d",
    name: "Couple Photo 3D",
    price: "₹99",
    priceValue: 99,
    icon: "Heart",
    badge: null,
    features: [
      "1 Couple Photo",
      "3D Depth & Animation",
      "Ambient Sound",
      "Share & Download",
    ],
  },
  {
    id: "family-3d",
    name: "Family Puja Memory",
    price: "₹149",
    priceValue: 149,
    icon: "Users",
    badge: null,
    features: [
      "1 Family Photo",
      "3D Animation",
      "Ambient Sound",
      "Share & Download",
    ],
  },
  {
    id: "cinematic",
    name: "Premium Cinematic",
    price: "₹249",
    priceValue: 249,
    icon: "Film",
    badge: null,
    features: [
      "Cinematic Effects",
      "Header Music",
      "15 Sec Video",
      "Share & Download",
    ],
  },
  {
    id: "memory-pack",
    name: "Memory Pack",
    price: "₹399",
    priceValue: 399,
    icon: "Package",
    badge: "SAVE 40%",
    features: [
      "Create 10 Memories",
      "Any Combo",
      "Best Value",
      "Share Everything",
    ],
  },
];

export interface MemoryDemo {
  id: string;
  title: string;
  image: string;
}

export const memoryDemosData: MemoryDemo[] = [
  {
    id: "d1",
    title: "Pandal Moments in 3D",
    image: "/images/puja-moments/2.png",
  },
  {
    id: "d2",
    title: "Couple Memories in 3D",
    image: "/images/puja-moments/3.png",
  },
  {
    id: "d3",
    title: "Family Memories in 3D",
    image: "/images/puja-moments/4.png",
  },
  {
    id: "d4",
    title: "Relive Every Detail",
    image: "/images/puja-moments/1.png",
  },
];

export const memorySteps = [
  {
    num: 1,
    icon: "Upload",
    title: "Upload Your Photo",
    desc: "Upload any Puja, couple, family or pandal photo.",
  },
  {
    num: 2,
    icon: "Sparkles",
    title: "AI Creates 3D Magic",
    desc: "Our AI converts your photo into immersive 3D depth with beautiful effects.",
  },
  {
    num: 3,
    icon: "Play",
    title: "Relive the Moment",
    desc: "Experience your memory in stunning 3D with ambient sound and effects.",
  },
  {
    num: 4,
    icon: "Share",
    title: "Share & Cherish",
    desc: "Share with your loved ones and keep the memory forever.",
  },
];

export const trustBadgesData = [
  {
    icon: "Shield",
    title: "Secure & Private",
    desc: "Your photos are safe with us",
  },
  {
    icon: "Tv",
    title: "High Quality Output",
    desc: "Best in class 3D experience",
  },
  {
    icon: "Zap",
    title: "Quick Processing",
    desc: "Get your memory in 60-120 seconds",
  },
  {
    icon: "Monitor",
    title: "Works on All Devices",
    desc: "Mobile, Tablet & VR Headsets",
  },
  {
    icon: "Heart",
    title: "Loved by Thousands",
    desc: "50,000+ happy customers",
  },
];
