// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains is deprecated in newer Next.js versions, strictly use remotePatterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      // 👇 Add this temporarily to allow ALL images for testing
      {
        protocol: "https",
        hostname: "**", 
      }
    ],
  },
    // Disable source maps in dev
  productionBrowserSourceMaps: false, // optional
  turbopack: {}, 
  // keep other existing config if any
};

export default nextConfig;