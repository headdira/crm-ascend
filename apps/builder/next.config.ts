import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@crm-ascend/validation"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.base44.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_PROVISIONER_URL: process.env.PROVISIONER_URL ?? "http://localhost:4010",
    NEXT_PUBLIC_CRM_URL: process.env.CRM_URL ?? process.env.NEXT_PUBLIC_CRM_URL ?? "http://localhost:3001",
  },
};

export default nextConfig;
