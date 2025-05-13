import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true, // Ensures all paths end with a slash
  images: {
    unoptimized: true, // Disables image optimization
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during builds
  },
  devIndicators: false, // Disables development indicators
};

export default nextConfig;