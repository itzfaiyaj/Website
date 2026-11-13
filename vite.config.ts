import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// In development the browser talks only to :5173, and /api is proxied to Express.
// Same origin = auth cookies just work, no CORS headaches.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": { target: "http://localhost:5000" } },
  },
});
