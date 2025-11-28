import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["upload.wikimedia.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      }
    ],
  },
};

export default nextConfig;
