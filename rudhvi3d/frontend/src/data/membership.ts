export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  badge: string | null;
  features: string[];
  cta: string;
  highlight: boolean;
}

export const membershipPlans: MembershipPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    priceValue: 0,
    badge: null,
    features: ['1 Pandal Access', '2 Min Preview', 'Mobile Access'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    id: 'festival-pass',
    name: 'Festival Pass',
    price: '₹99',
    priceValue: 99,
    badge: 'MOST POPULAR',
    features: ['100+ Pandal Access', '360° Experience', 'Spatial Audio', 'Festival Passport', 'Mobile + Desktop'],
    cta: 'Get Pass',
    highlight: true,
  },
  {
    id: 'premium-pass',
    name: 'Premium Pass',
    price: '₹299',
    priceValue: 299,
    badge: null,
    features: ['All Festival Pass Features', 'VR Immersion', 'Behind The Scenes', 'Exclusive Content', 'Early Access'],
    cta: 'Go Premium',
    highlight: false,
  },
];

export const membershipBenefits = [
  'Mobile, Web, Smart TV & VR Support',
  'HD Quality Streaming',
  'Secure & Safe Payments',
  'Cancel Anytime',
];
