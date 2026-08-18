export interface Feature {
  id: string;
  icon: string;
  label: string;
  description?: string;
}

export const featuresData: Feature[] = [
  { id: "immersive-view", icon: "Degree", label: "Immersive View" },
  { id: "day-night", icon: "Experience", label: "Day & Night Experience" },
  { id: "spatial-audio", icon: "Audio", label: "Spatial Audio" },
  { id: "3d-map", icon: "Map", label: "3D Interactive Map" },
  { id: "vr-immersion", icon: "Vr", label: "VR Immersion" },
  { id: "festival-pass", icon: "Pass", label: "Festival Pass" },
];
