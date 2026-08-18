export interface VRProduct {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  features: string[];
  includesMembership: string;
}

export const vrProductData: VRProduct = {
  id: 'vr-viewer-1',
  name: 'RUDHVI VR Viewer',
  price: '₹499',
  priceValue: 499,
  image: '/images/cta/vr image.png',
  features: [
    'Lightweight & Comfortable',
    'Adjustable Lenses',
    'Works with Android & iOS',
    'Premium Build Quality',
  ],
  includesMembership: '1 Month Premium Membership',
};
