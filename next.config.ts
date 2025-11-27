import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["upload.wikimedia.org"],
  },
    // Disable source maps in dev
  productionBrowserSourceMaps: false, // optional
  turbopack: {}, 
  // keep other existing config if any
};

export default nextConfig;
