import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// 1. Initialize the PWA wrapper with your production settings
const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable in dev mode to avoid caching frustrations
  register: true,
  workboxOptions: {
    skipWaiting: true, // 🌟 FIXED: Moved inside workboxOptions to satisfy TypeScript definitions
    // Exclude API layers, admin dashboards, and dynamic transactional screens from offline caching
    exclude: [
      /.*\/api\/.*/,
      /.*\/checkout\/.*/,
      /.*\/dashboard\/.*/,
      /.*\/orders\/.*/,
      /.*\/admin\/.*/
    ],
  }
});

// 2. Define your existing configurations securely
const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],
  },
};

// 3. Export the combined result
export default withPWA(nextConfig);