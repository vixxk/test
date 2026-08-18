export interface NavLink {
  label: string;
  href: string;
  badge?: string;
}

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Experiences', href: '/#experiences' },
  { label: 'Explore Map', href: '/#explore' },
  { label: 'Membership', href: '/#membership' },
  { label: '3D Memories', href: '/3d-memories', badge: 'New' },
  { label: 'VR Store', href: '/#vr-store' },
  { label: 'Admin Panel', href: '/admin', badge: 'Admin' },
];

export const footerLinks = {
  explore: ['360° Pandals', 'VR Experiences', '3D Memories', 'Live Aarti', 'Puja & Seva'],
  company: ['About Us', 'Press', 'Partners', 'Blog', 'Support'],
};
