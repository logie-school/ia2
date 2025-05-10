import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static export
  trailingSlash: true, // Ensures all paths end with a slash for static export
  images: {
    unoptimized: true, // Disables image optimization for static export
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during builds
  },
  devIndicators: false, // Disables development indicators
};

export default nextConfig;