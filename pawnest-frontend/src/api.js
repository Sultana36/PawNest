// One place for the backend address.
// Locally this stays http://localhost:5000.
// After deploying, set VITE_API_URL (for example on Vercel) to your live server address.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
