import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Webpack config for cross-platform compatibility (Turbopack not supported on Android)
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
