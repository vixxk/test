export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";
export const VR_VIEWER_URL = (import.meta as any).env?.VITE_VR_VIEWER_URL || API_BASE_URL;
export const FRONTEND_URL = (import.meta as any).env?.VITE_FRONTEND_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173");
