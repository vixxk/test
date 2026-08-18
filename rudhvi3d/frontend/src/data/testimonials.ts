export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar?: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 't1',
    name: 'Ananya Mukherjee',
    location: 'Delhi',
    text: "Being away from Kolkata during Durga Puja was always painful. RUDHVI brought the pandals to my living room in stunning 360°. It felt like I was really there!",
    rating: 5,
  },
  {
    id: 't2',
    name: 'Rajesh Banerjee',
    location: 'Mumbai',
    text: 'The VR experience is phenomenal. The spatial audio of dhak and the visual grandeur of Kumartuli Park gave me goosebumps. Worth every rupee!',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Priya Dasgupta',
    location: 'Bangalore',
    text: 'Created a 3D memory of our family at Bagbazar pandal. The AI depth effect is magical - it feels like stepping back into that moment. Shared it with everyone!',
    rating: 5,
  },
];
