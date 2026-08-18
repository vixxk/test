import Pandal from '../models/Pandal.js';

export const initialPandals = [
  {
    id: 'salt-lake-1',
    name: 'Salt Lake Puja',
    location: 'Salt Lake, Kolkata',
    locationTag: 'SALT LAKE',
    image: '/images/pandel/p2.png',
    rating: 4.8,
    status: 'active',
    isFeatured: true,
    isNew: false,
    accessType: 'premium',
    displayOrder: 1,
    mapUrl: 'https://maps.google.com/?q=Salt+Lake+Kolkata',
    features: ['360° View', 'Day & Night', '3D Map'],
    description: 'Magnificent marble palace hall featuring ornate golden chandeliers, decorative archways, sitar displays, and royal blue ceiling dome.',
    scenes: {
      exterior: {
        title: 'Salt Lake Puja · Exterior Courtyard',
        subtitle: 'Main approach · Select the entrance arrow to go inside',
        category: 'exterior',
        image: '/assets/saltlake-exterior-360.png',
        portalTitle: 'Enter Puja Pandal',
        portalNote: 'Continue to the Durga Pratima Hall',
        portalIcon: 'fa-arrow-down',
        portalPosition: { x: 0, y: -2.2, z: -14 },
        nextSceneId: 'interior',
        hotspots: [
          {
            id: 'exterior-welcome',
            position: { x: 0, y: 1.5, z: -12 },
            title: 'Welcome Archway',
            icon: 'fa-archway',
            desc: 'Ornate illuminated welcome arch of Salt Lake Sarbojanin Durga Puja pandal.'
          }
        ],
        waypoints: [
          { id: 'entrance', name: 'Courtyard Approach', pos: { x: 0, y: -4.2, z: 8 }, target: { x: 0, y: 0, z: -14 } },
          { id: 'gate', name: 'Grand Gate', pos: { x: 0, y: -4.2, z: -2 }, target: { x: 0, y: 0, z: -14 } }
        ]
      },
      interior: {
        title: 'Salt Lake Grand Palace · Interior Hall',
        subtitle: 'Durga Pratima Hall · 360° immersive darshan',
        category: 'interior',
        image: '/assets/saltlake-interior-360.png',
        portalTitle: 'Return Outside',
        portalNote: 'Back to the exterior courtyard',
        portalIcon: 'fa-arrow-left',
        portalPosition: { x: 0, y: -1.8, z: 14 },
        nextSceneId: 'exterior',
        hotspots: [
          {
            id: 'idol',
            position: { x: 0, y: 1.2, z: -14 },
            title: 'Maa Durga Pratima',
            icon: 'fa-om',
            desc: 'Ten-armed Goddess Durga slaying Mahishasura, flanked by Lakshmi, Saraswati, Ganesha & Kartikeya.'
          }
        ],
        waypoints: [
          { id: 'sanctum', name: 'Sacred Pratima Altar', pos: { x: 0, y: -4.2, z: -7 }, target: { x: 0, y: 1, z: -14 } }
        ]
      }
    }
  },
  {
    id: 'new-town-1',
    name: 'New Town Puja',
    location: 'New Town, Kolkata',
    locationTag: 'NEW TOWN',
    image: '/images/pandel/p6.png',
    rating: 4.9,
    status: 'active',
    isFeatured: true,
    isNew: true,
    accessType: 'free',
    displayOrder: 2,
    mapUrl: 'https://maps.google.com/?q=New+Town+Kolkata',
    features: ['360° View', 'Day & Night', '3D Map'],
    description: 'Modern artistic pandal representation with vibrant illumination, traditional craftsmanship, and 360 VR interactive walkthrough.',
    scenes: {
      exterior: {
        title: 'New Town Puja · Grand Entrance',
        subtitle: 'Eco Park Walkway · 360° View',
        category: 'exterior',
        image: '/assets/saltlake-exterior-360.png',
        portalTitle: 'Enter Pandal Sanctum',
        portalNote: 'Proceed to Durga Idol Hall',
        portalIcon: 'fa-arrow-down',
        portalPosition: { x: 0, y: -2.2, z: -14 },
        nextSceneId: 'interior',
        hotspots: [
          {
            id: 'nt-gate',
            position: { x: 0, y: 1.5, z: -12 },
            title: 'Eco Entrance Gate',
            icon: 'fa-leaf',
            desc: 'Eco-friendly illuminated theme gate of New Town Durga Puja.'
          }
        ],
        waypoints: [
          { id: 'entrance', name: 'Walkway Approach', pos: { x: 0, y: -4.2, z: 8 }, target: { x: 0, y: 0, z: -14 } }
        ]
      },
      interior: {
        title: 'New Town Puja · Main Sanctum',
        subtitle: 'Pratima Darshan · 360° View',
        category: 'interior',
        image: '/assets/saltlake-interior-360.png',
        portalTitle: 'Exit Sanctum',
        portalNote: 'Return to Eco Park Walkway',
        portalIcon: 'fa-arrow-left',
        portalPosition: { x: 0, y: -1.8, z: 14 },
        nextSceneId: 'exterior',
        hotspots: [
          {
            id: 'nt-idol',
            position: { x: 0, y: 1.2, z: -14 },
            title: 'Maa Durga Pratima',
            icon: 'fa-om',
            desc: 'Traditional clay idol sanctum at New Town Sarbojanin.'
          }
        ],
        waypoints: [
          { id: 'sanctum', name: 'Pratima Altar', pos: { x: 0, y: -4.2, z: -7 }, target: { x: 0, y: 1, z: -14 } }
        ]
      }
    }
  },
  {
    id: 'chetla-1',
    name: 'Chetla Puja',
    location: 'Chetla, South Kolkata',
    locationTag: 'SOUTH KOLKATA',
    image: '/images/pandel/p3.png',
    rating: 4.7,
    status: 'active',
    isFeatured: false,
    isNew: false,
    accessType: 'premium',
    displayOrder: 3,
    mapUrl: 'https://maps.google.com/?q=Chetla+Kolkata',
    features: ['360° View', 'Terracotta Art', 'Audio Guide'],
    description: 'Heritage South Kolkata Puja famous for traditional terracotta wall sculptures, dhak rhythms, and royal Pratima.',
    scenes: {
      exterior: {
        title: 'Chetla Puja · Heritage Gate',
        subtitle: 'Chetla Park Entrance · 360° View',
        category: 'exterior',
        image: '/assets/saltlake-exterior-360.png',
        portalTitle: 'Enter Pandal',
        portalNote: 'Walk inside the Terracotta Hall',
        portalIcon: 'fa-arrow-down',
        portalPosition: { x: 0, y: -2.2, z: -14 },
        nextSceneId: 'interior',
        hotspots: [],
        waypoints: []
      },
      interior: {
        title: 'Chetla Puja · Terracotta Sanctum',
        subtitle: 'Traditional Pratima Hall',
        category: 'interior',
        image: '/assets/saltlake-interior-360.png',
        portalTitle: 'Exit to Park',
        portalNote: 'Back outside',
        portalIcon: 'fa-arrow-left',
        portalPosition: { x: 0, y: -1.8, z: 14 },
        nextSceneId: 'exterior',
        hotspots: [],
        waypoints: []
      }
    }
  },
  {
    id: 'patuli-1',
    name: 'Patuli Puja',
    location: 'Patuli, Kolkata',
    locationTag: 'PATULI',
    image: '/images/pandel/p5.png',
    rating: 4.6,
    status: 'active',
    isFeatured: false,
    isNew: true,
    accessType: 'free',
    displayOrder: 4,
    mapUrl: 'https://maps.google.com/?q=Patuli+Kolkata',
    features: ['360° View', 'Floating Park', 'Illumination'],
    description: 'Picturesque floating lake pandal with glowing decorative lanterns, reflection artwork, and 3D virtual tour.',
    scenes: {
      exterior: {
        title: 'Patuli Puja · Lake Promenade',
        subtitle: 'Floating Park Gate · 360° View',
        category: 'exterior',
        image: '/assets/saltlake-exterior-360.png',
        portalTitle: 'Enter Lake Pavilion',
        portalNote: 'Go inside the floating hall',
        portalIcon: 'fa-arrow-down',
        portalPosition: { x: 0, y: -2.2, z: -14 },
        nextSceneId: 'interior',
        hotspots: [],
        waypoints: []
      },
      interior: {
        title: 'Patuli Puja · Floating Pavilion',
        subtitle: 'Lakeside Pratima Darshan',
        category: 'interior',
        image: '/assets/saltlake-interior-360.png',
        portalTitle: 'Exit Pavilion',
        portalNote: 'Return to Promenade',
        portalIcon: 'fa-arrow-left',
        portalPosition: { x: 0, y: -1.8, z: 14 },
        nextSceneId: 'exterior',
        hotspots: [],
        waypoints: []
      }
    }
  }
];

export const seedDatabase = async () => {
  try {
    const count = await Pandal.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty. Seeding initial Pandals...');
      await Pandal.insertMany(initialPandals);
      console.log('✅ Successfully seeded 4 initial Pandals into MongoDB!');
    } else {
      console.log(`ℹ️ MongoDB already contains ${count} Pandals. Skipping seed.`);
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
};
