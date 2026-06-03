import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@crm-ascend/db", "@crm-ascend/validation"],
  serverActions: {
    // Banners até 5 MB via FormData (upload único e em massa)
    bodySizeLimit: "10mb",
  },
  images: {
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.base44.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
