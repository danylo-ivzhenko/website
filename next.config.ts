import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone mode was hiding the 'public' folder images. Switching back to standard.
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  serverExternalPackages: ["bcryptjs"],
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
