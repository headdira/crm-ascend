import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@crm-ascend/db", "@crm-ascend/validation"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [384, 640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [50, 60, 65, 75],
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
