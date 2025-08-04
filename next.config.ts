import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker with runtime env support
  output: 'standalone',
  
  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  /* config options here */
};

export default nextConfig;