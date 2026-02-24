import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  serverExternalPackages: ["bcryptjs"],
  experimental: {
    // Increase body size limit for server action file uploads (50MB)
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
