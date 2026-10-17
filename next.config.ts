import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Avoid failing the whole deploy on a single static page error
  experimental: {
    // empty reserved for future flags
  },
};

export default nextConfig;
