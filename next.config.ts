import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set turbopack root to fix workspace warnings
  turbopack: {
    root: __dirname,
  },
  
  // Fix source map warnings in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Clean up build output  
  cleanDistDir: true,
};

export default nextConfig;
