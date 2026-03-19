// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        hostname: 'images.unsplash.com', // For the category tiles
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // 🚀 Added for mock data images
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Ensure this matches your BACKEND port
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;