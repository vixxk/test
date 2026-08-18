export interface Pandal {
  id: string;
  name: string;
  location: string;
  locationTag: string;
  image: string;
  features: string[];
  hasVR: boolean;
  has360: boolean;
  rating?: number;
  vrUrl?: string;
  accessType?: 'free' | 'premium';
  status?: 'active' | 'inactive' | 'archived';
  isFeatured?: boolean;
  isNew?: boolean;
  displayOrder?: number;
  mapUrl?: string;
  description?: string;
}

export const pandalsData: Pandal[] = [
  {
    id: 'new-town-1',
    name: 'New Town Puja',
    location: 'New Town, Kolkata',
    locationTag: 'NEW TOWN',
    image: '/images/pandel/p6.png',
    features: ['360° View', 'Day & Night', '3D Map'],
    hasVR: true,
    has360: true,
    rating: 4.9,
    accessType: 'free',
    isFeatured: true,
    isNew: true,
    displayOrder: 1,
    vrUrl: 'http://localhost:5000/?pandal=new-town-1',
  },
  {
    id: 'salt-lake-1',
    name: 'Salt Lake Puja',
    location: 'Salt Lake, Kolkata',
    locationTag: 'SALT LAKE',
    image: '/images/pandel/p2.png',
    features: ['360° View', 'Day & Night', '3D Map'],
    hasVR: true,
    has360: true,
    rating: 4.8,
    accessType: 'premium',
    isFeatured: true,
    isNew: false,
    displayOrder: 2,
    vrUrl: 'http://localhost:5000/?pandal=salt-lake-1',
  },
  {
    id: 'chetla-1',
    name: 'Chetla Puja',
    location: 'Chetla Tollygunge',
    locationTag: 'CHETLA TOLLYGUNGE',
    image: '/images/pandel/p3.png',
    features: ['360° View', 'Day & Night', '3D Map'],
    hasVR: true,
    has360: true,
    rating: 4.7,
    accessType: 'premium',
    isFeatured: false,
    isNew: false,
    displayOrder: 3,
    vrUrl: 'http://localhost:5000/?pandal=chetla-1',
  },
  {
    id: 'patuli-1',
    name: 'Patuli Pujo',
    location: 'Patuli, Kolkata',
    locationTag: 'PATULI',
    image: '/images/pandel/p4.png',
    features: ['360° View', 'Day & Night', '3D Map'],
    hasVR: true,
    has360: true,
    rating: 4.6,
    accessType: 'free',
    isFeatured: false,
    isNew: true,
    displayOrder: 4,
    vrUrl: 'http://localhost:5000/?pandal=patuli-1',
  },
];
