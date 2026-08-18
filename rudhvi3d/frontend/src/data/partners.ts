export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
}

export const partnersData: Partner[] = [
  {
    id: 'sbi',
    name: 'SBI',
    logoUrl: '/images/partner/sbi.png',
    website: '#',
  },
  {
    id: 'patanjali',
    name: 'Patanjali',
    logoUrl: '/images/partner/patanjali.png',
    website: '#',
  },
  {
    id: 'reliance',
    name: 'Reliance',
    logoUrl: '/images/partner/reliance.png',
    website: '#',
  },
  {
    id: 'fortune',
    name: 'Fortune',
    logoUrl: '/images/partner/fortune.png',
    website: '#',
  },
  {
    id: 'ola',
    name: 'OLA',
    logoUrl: '/images/partner/ola.png',
    website: '#',
  },
  {
    id: 'byjus',
    name: "BYJU'S",
    logoUrl: '/images/partner/byjus.png',
    website: '#',
  },
];

export const partnersBarConfig = {
  title: 'POWERED BY OUR PARTNERS',
};
